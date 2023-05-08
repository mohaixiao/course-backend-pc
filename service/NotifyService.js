const svgCaptcha = require('svg-captcha');
const redisConfig = require('../config/redisConfig');


const NotifyService = {
    captcha: async (key, type) => {
        let captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 1, //干扰线
            background: '#aaa' // 背景颜色
        })

        redisConfig.set(`${type}:captcha:${key}`, captcha.text, 600)
        return captcha.data;
    }
}

module.exports = NotifyService;

