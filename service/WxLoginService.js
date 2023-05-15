const SecretTool = require('../utils/SecretTool')

const WxLoginService = {
    wechat_insert: (signature, timestamp, nonce, echostr) => {
        let token = 'testxdclass'
        let str = SecretTool.sha1([token, timestamp, nonce].sort().join(''))
        if (str === signature) {
            return echostr
        }
    }
}

module.exports = WxLoginService