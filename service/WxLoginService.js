const SecretTool = require('../utils/SecretTool')
const { getOR } = require('../config/wechatLogin')
const redisConfig = require('../config/redisConfig')
const BackCode = require('../utils/BackCode')
const WxDataTool = require('../utils/WxDataTool')
const DB = require('../config/sequelize')
const RandomTool = require('../utils/RandomTool')
const CodeEnum = require('../utils/CodeEnum')

const WxLoginService = {
    wechat_insert: (signature, timestamp, nonce, echostr) => {
        let token = 'testxdclass'
        let str = SecretTool.sha1([token, timestamp, nonce].sort().join(''))
        if (str === signature) {
            return echostr
        }
    },
    login: async () => {
        // 获取二维码url
        let { qrcodeUrl, ticket } = await getOR()
        // 将ticket存入redis缓存
        let key = `wechat:ticket:${ticket}`
        redisConfig.set(key, JSON.stringify({ isScan: 'no' }), 120)
        return BackCode.buildSuccessAndData({ data: { qrcodeUrl, ticket } })
    },
    wechat_message: async (req) => {
        // let xmlData = await WxDataTool.getXMLStr(req)
        let xmlData = Object.keys(req.body)[0]
        let objectData = await WxDataTool.getObject(xmlData)
        let lastData = WxDataTool.getLastData(objectData.xml)

        // 根据openid判断是否注册过
        let openidRes = DB.Account.findAll({ where: { openid: lastData.FromUserName }, raw: true });
        //随机生成用户的头像和昵称
        let head_img = RandomTool.randomAvatar()
        let username = RandomTool.randomName()
        let user = null;
        // 未注册则插入数据
        if (openidRes.length === 0) {
            let resData = await DB.Account.create({ head_img, username, id: lastData.FromUserName })
            user = { head_img, username, id: resData.toJSON().id }
        } else {
            // 注册过
            user = { head_img: openidRes[0].head_img, username: openidRes[0].username, id: openidRes[0].id }
        }
        // 生成token
        let token = SecretTool.jwtSign(user, '168h')
        // 更新redis状态 
        let key = `wechat:ticket:${lastData.Ticket}`
        const existsKey = redisConfig.exists(key);
        if (existsKey) {
            redisConfig.set(key, JSON.stringify({ isScan: 'yes', token }), 120)
        }
        // 返回微信服务器的内容
        let content = ''
        if (lastData.MsgType == 'event') {
            if (lastData.Event = 'SCAN') {
                content = '欢迎回来'
            } else if (lastData.Event = 'subscribe') {
                content = '感谢关注'
            }

            let msgStr = `<xml>
              <ToUserName><![CDATA[${lastData.FromUserName}]]></ToUserName>
              <FromUserName><![CDATA[${lastData.ToUserName}]]></FromUserName>
              <CreateTime>${Date.now()}</CreateTime>
              <MsgType><![CDATA[text]]></MsgType>
              <Content><![CDATA[${content}]]></Content>
             </xml>`
            return msgStr
        }
    },
    check_scan: async (req) => {
        let { ticket } = req.query;
        let key = `wechat:ticket:${ticket}`
        let redisData = JSON.parse(await redisConfig.get(key))
        if (redisData && redisData.isScan === 'yes') {
            let { token } = redisData
            return BackCode.buildSuccessAndData({ data: `Bearer ${token}` })
        } else {
            return BackCode.buildResult(CodeEnum.WECHAT_WAIT_SCAN)
        }

    }
}

module.exports = WxLoginService