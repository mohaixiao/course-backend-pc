/**
 * @param wechat_insert 验证微信接入
 */
const WxLoginService = require('../service/WxLoginService')

const WxLoginController = {
    wechat_insert: (req, res) => {
        // 从微信服务器拿对称加密的参数
        let { signature, timestamp, nonce, echostr } = req.query
        let handleRes = WxLoginService.wechat_insert(signature, timestamp, nonce, echostr)
        res.send(handleRes)
    }

}


module.exports = WxLoginController