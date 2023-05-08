/**
 * @param {*} captcha 图形验证码接口
 * @param {*} sendCode 手机验证码接口
 */

const NotifyService = require('../service/NotifyService.js')
const SecretTool = require('../utils/SecretTool');
const GetUserInfoTool = require('../utils/GetUserInfoTool');
// 用户的ip+设备md5加密
const getKey = (req) => {
    return SecretTool.md5(GetUserInfoTool.getIP(req) + GetUserInfoTool.GetUseragent(req));
};

const NotifyController = {
    captcha: async (req, res) => {
        let key = getKey(req);
        let { type } = req.query;
        let handleRes = await NotifyService.captcha(key, type)
        // 设置返回数据为图片格式
        res.set('content-type', 'image/svg+xml')
        res.send(handleRes)
    }
}

module.exports = NotifyController