/**
 * @param {*} captcha 图形验证码接口
 * @param {*} sendCode 手机验证码接口
 */

const NotifyService = require('../service/NotifyService.js')
const GetUserInfoTool = require('../utils/GetUserInfoTool')
const SecretTool = require('../utils/SecretTool')
const RandomTool = require('../utils/RandomTool')

const NotifyController = {
    captcha: (req, res) => {
        let { type } = req.query
        // 用户的ip+设备md5加密
        let _key = SecretTool.md5(GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req))
        let handleRes = NotifyService.captcha(_key, type)
        // 设置返回数据为图片格式
        res.set('content-type', 'image/svg+xml')
        res.send(handleRes)
    },

    sendCode: async (req, res) => {
        let { phone, captcha, type } = req.body
        // 用户的ip+设备md5加密
        let _key = SecretTool.md5(GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req))
        let handleRes = await NotifyService.sendCode(phone, captcha, type, _key, RandomTool.randomCode())
        res.send(handleRes)
    }
}

module.exports = NotifyController