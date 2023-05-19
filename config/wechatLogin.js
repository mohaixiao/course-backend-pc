const axios = require("axios");

const appId = 'wx5beac15ca207c40c'
const appSecret = '8189e5f14346ccaa3bd5f6909f31a362'
const accessTokenPC = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
const qrUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode'

// 获取微信access_token
const getAccessToken = () => {
    return axios({
        method: 'get',
        url: accessTokenPC
    })
}


// 获取拼接微信二维码url的ticket
const getTicket = () => {
    return axios({
        method: "post",
        url: `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${token}`,
        data: {
            expire_seconds: 60 * 2, // 倒计时
            action_name: "QR_SCENE",
            action_info: {
                "scene": { "scene_id": 123 }
            }
        }
    })
}

// 获取微信二维码url
const wechatLogin = {
    getOR: async () => {
        let token = (await getAccessToken()).data.access_token
        let ticket = (await getTicket(token)).data.ticket
        return { qrcodeUrl: `${qrUrl}?ticket=${ticket}`, ticket: ticket }
    }
}

module.exports = wechatLogin