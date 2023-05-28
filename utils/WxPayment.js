const urllib = require('urllib');
const { KJUR, hextob64 } = require('jsrsasign')
const RandomTool = require('./RandomTool')

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
        }
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
}

module.exports = WxPayment;

