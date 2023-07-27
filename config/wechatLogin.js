const axios = require("axios");

const appId = 'Ek7blIsBmbSfMjjUjK'
const appSecret = 'Vwqd07rdbhCSpc6DfGZjyy1zCkfhJnYE'
const accessTokenPC = `https://api-v2.xdclass.net/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
const qrUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode'

// 获取微信access_token
const getAccessToken = () => {
    return axios({
        method: 'get',
        url: accessTokenPC
    })
}

// 获取拼接微信二维码url的ticket
const getTicket = (token) => {
    return axios({
        method: 'post',
        url: `https://api-v2.xdclass.net/cgi-bin/qrcode/create?access_token=${token}`,
        data: {
            expire_seconds: 60 * 2,
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