const urllib = require('urllib');
const { KJUR, hextob64 } = require('jsrsasign')
const RandomTool = require('./RandomTool')
const crypto = require("crypto");
const x509 = require('@peculiar/x509');

class WxPayment {
    constructor({ appid, mchid, private_key, serial_no, apiv3_private_key, notify_url } = {}) {
        this.appid = appid; // 公众号appid
        this.mchid = mchid; // 商户号mchid
        this.private_key = private_key; // 商户私钥
        this.serial_no = serial_no; // 证书序列号，用于声明所使用的证书
        this.apiv3_private_key = apiv3_private_key; // APIv3密钥，解密平台证书
        this.notify_url = notify_url; // 回调地址

        this.requestUrls = {
            // pc端native下单API
            native: () => {
                return {
                    url: 'https://api.mch.weixin.qq.com/v3/pay/transactions/native',
                    method: 'POST',
                    pathname: '/v3/pay/transactions/native',
                }
            },
            // 获取平台证书url
            getCertificates: () => {
                return {
                    url: `https://api.mch.weixin.qq.com/v3/certificates`,
                    method: `GET`,
                    pathname: `/v3/certificates`,
                }
            },
            // 通过out_trade_no查询订单url配置
            getTransactionsByOutTradeNo: ({ pathParams }) => {
                return {
                    url: `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${pathParams.out_trade_no}?mchid=${this.mchid}`,
                    method: `GET`,
                    pathname: `/v3/pay/transactions/out-trade-no/${pathParams.out_trade_no}?mchid=${this.mchid}`,
                }
            },
        }
        // 初始化平台证书
        this.decodeCertificates()
    }

    // 通过out_trade_no查询订单
    async getTransactionsByOutTradeNo(params) {
        return await this.wxSignRequest({ pathParams: params, type: 'getTransactionsByOutTradeNo' })
    }

    // 请求微信服务器签名封装
    async wxSignRequest({ pathParams, bodyParams, type }) {
        let { url, method, pathname } = this.requestUrls[type]({ pathParams })
        let timestamp = Math.floor(Date.now() / 1000) // 时间戳
        let onece_str = RandomTool.randomString(32);  // 随机串 
        let bodyParamsStr = bodyParams && Object.keys(bodyParams).length ? JSON.stringify(bodyParams) : '' // 请求报文主体
        let signature = this.rsaSign(`${method}\n${pathname}\n${timestamp}\n${onece_str}\n${bodyParamsStr}\n`, this.private_key, 'SHA256withRSA')
        // 请求头传递签名
        let Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchid}",nonce_str="${onece_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${this.serial_no}"`
        // 接口请求
        let { status, data } = await urllib.request(url, {
            method: method,
            dataType: 'text',
            data: method == 'GET' ? '' : bodyParams,
            timeout: [10000, 15000],
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': Authorization
            },
        })
        return { status, data }
    }


    //native统一下单
    async native(params) {
        let bodyParams = {
            ...params,
            appid: this.appid,
            mchid: this.mchid,
            notify_url: this.notify_url,
        }
        return await this.wxSignRequest({ bodyParams, type: 'native' })
    }

    // 获取平台证书
    async getCertificates() {
        return await this.wxSignRequest({ type: 'getCertificates' })
    }


    /**
     * rsa签名
     * @param content 签名内容
     * @param privateKey 私钥，PKCS#1
     * @param hash hash算法，SHA256withRSA
     * @returns 返回签名字符串，base64
     */
    rsaSign(content, privateKey, hash = 'SHA256withRSA') {
        // 创建 Signature 对象
        const signature = new KJUR.crypto.Signature({
            alg: hash,
            // 私钥
            prvkeypem: privateKey
        })
        // 传入待加密字符串
        signature.updateString(content)
        // 生成密文
        const signData = signature.sign()
        // 将内容转成base64
        return hextob64(signData)
    }

    //验证签名 timestamp,nonce,serial,signature均在HTTP头中获取,body为请求参数
    async verifySign({ timestamp, nonce, serial, body, signature }) {
        // 拼接参数
        let data = `${timestamp}\n${nonce}\n${typeof body == 'string' ? body : JSON.stringify(body)}\n`;
        // 用crypto模块解密
        let verify = crypto.createVerify('RSA-SHA256');
        // 添加摘要内容
        verify.update(Buffer.from(data));
        // 从初始化的平台证书中获取公钥
        for (let cert of this.certificates) {
            if (cert.serial_no == serial) {
                return verify.verify(cert.public_key, signature, 'base64');
            } else {
                throw new Error('平台证书序列号不相符')
            }
        }
    }

    //解密证书列表 解出CERTIFICATE以及public key
    async decodeCertificates() {
        let result = await this.getCertificates();
        if (result.status != 200) {
            throw new Error('获取证书列表失败')
        }
        let certificates = typeof result.data == 'string' ? JSON.parse(result.data).data : result.data.data
        for (let cert of certificates) {
            let output = this.decode(cert.encrypt_certificate)
            cert.decrypt_certificate = output.toString()
            let beginIndex = cert.decrypt_certificate.indexOf('-\n')
            let endIndex = cert.decrypt_certificate.indexOf('\n-')
            let str = cert.decrypt_certificate.substring(beginIndex + 2, endIndex)
            // 生成X.509证书
            let x509Certificate = new x509.X509Certificate(Buffer.from(str, 'base64'));
            let public_key = Buffer.from(x509Certificate.publicKey.rawData).toString('base64')
            // 平台证书公钥
            cert.public_key = `-----BEGIN PUBLIC KEY-----\n` + public_key + `\n-----END PUBLIC KEY-----`
        }
        return this.certificates = certificates
    }

    //解密
    decode(params) {
        const AUTH_KEY_LENGTH = 16;
        // ciphertext = 密文，associated_data = 填充内容， nonce = 位移
        const { ciphertext, associated_data, nonce } = params;
        // 密钥
        const key_bytes = Buffer.from(this.apiv3_private_key, 'utf8');
        // 位移
        const nonce_bytes = Buffer.from(nonce, 'utf8');
        // 填充内容
        const associated_data_bytes = Buffer.from(associated_data, 'utf8');
        // 密文Buffer
        const ciphertext_bytes = Buffer.from(ciphertext, 'base64');
        // 计算减去16位长度
        const cipherdata_length = ciphertext_bytes.length - AUTH_KEY_LENGTH;
        // upodata
        const cipherdata_bytes = ciphertext_bytes.slice(0, cipherdata_length);
        // tag
        const auth_tag_bytes = ciphertext_bytes.slice(cipherdata_length, ciphertext_bytes.length);
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm', key_bytes, nonce_bytes
        );
        decipher.setAuthTag(auth_tag_bytes);
        decipher.setAAD(Buffer.from(associated_data_bytes));

        const output = Buffer.concat([
            decipher.update(cipherdata_bytes),
            decipher.final(),
        ]);
        return output;
    }
}

module.exports = WxPayment;

