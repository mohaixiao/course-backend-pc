const svgCaptcha = require('svg-captcha');
const redisConfig = require('../config/redisConfig');
const sendMsgCode = require('../config/aliyunMessage');

const NotifyService = {
    captcha: async (key, type) => {
        let captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 1, //干扰线
            background: '#aaa' // 背景颜色
        })

        redisConfig.set(`${type}:captcha:` + key, captcha.text, 600)
        return captcha.data;
    },
    sendCode: async (phone, captcha, type, _key, randomCode) => {
        // 60秒内不能重复发送手机验证码
        if (await redisConfig.exists(`${type}:over:${phone}`)) {
            return { code: -1, msg: '60秒不能重复发送' }
        }

        // 是否有图形验证码
        if (!(await redisConfig.exists(`${type}:captcha:${_key}`))) {
            return { code: -1, msg: '请发送图形验证码' }
        }
        // 对比用户和redis的图形验证码 忽略大小写
        let captchaRedis = await redisConfig.get(`${type}:captcha:${_key}`)
        if (!(captcha.toLowerCase() === captchaRedis.toLowerCase())) {
            return { code: -1, msg: '图形验证码错误' }
        }

        // 手机验证码存redis
        redisConfig.set(`${type}:code:${phone}`, randomCode, 600);
        // 存60秒判断的key值
        redisConfig.set(`${type}:over:${phone}`, 1, 60);

        // 调用阿里云发送手机验证码
        let resCode = (await sendMsgCode(phone, randomCode)).data;
        if (resCode.code == '0') {
            return { code: 0, msg: '发送成功' }
        } else {
            return { code: -1, msg: '发送失败' }
        }
    }
}

module.exports = NotifyService;

