const svgCaptcha = require('svg-captcha');
const redisConfig = require('../config/redisConfig');
const sendMsgCode = require('../config/aliyunMessage');
const dayjs = require('dayjs');
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')

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
        if (await redisConfig.exists(`${type}:code:` + phone)) {
            let dateRedis = dayjs(Number((await redisConfig.get(`${type}:code:` + phone)).split('_')[0]))
            if (dayjs(Date.now()).diff(dateRedis, 'second') <= 60) {
                return BackCode.buildResult(CodeEnum.CODE_LIMITED)
            }
        }

        // 是否有图形验证码
        if (!(await redisConfig.exists(`${type}:captcha:${_key}`))) {
            return BackCode.buildError({ msg: '请发送图形验证码' })
        }

        // 缺少captcha参数
        if (!captcha) {
            return BackCode.buildError({ msg: '缺少captcha参数' })
        }

        // 对比用户和redis的图形验证码 忽略大小写
        let captchaRedis = await redisConfig.get(`${type}:captcha:${_key}`)
        if (!(captcha.toLowerCase() === captchaRedis.toLowerCase())) {
            return BackCode.buildError({ msg: '图形验证码错误' })
        }

        // 手机验证码存redis
        let randomCodeTime = `${Date.now()}_${randomCode}`
        redisConfig.set(`${type}:code:${phone}`, randomCodeTime, 600);

        // 删除图形验证码
        redisConfig.del(`${type}:captcha:${_key}`)

        // 调用阿里云发送手机验证码
        let codeRes = (await sendMsgCode(phone, randomCode)).data;
        if (codeRes.code == '0') {
            return BackCode.buildSuccessAndMsg({ msg: '发送成功' })
        } else {
            return BackCode.buildError({ msg: '发送失败' })
        }
    }
}

module.exports = NotifyService;

