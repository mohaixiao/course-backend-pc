const Payment = require('../utils/WxPayment')
const fs = require('fs')
const { resolve } = require('path')

const appid = 'wx5beac15ca207c40c' // 公众号appID
const mchid = '1601644442'  // 商户号mchID
const serial_no = '7064ADC5FE84CA2A3DDE71A692E39602DEB96E61' // 证书序列号，用于声明所使用的证书
const apiv3_private_key = 'k47rt4GYXinH6JwbjOUdNhrB4LPvvIHu' // APIv3密钥，用于声明所使用的证书
const notify_url = 'https://740833px45.yicp.fun/api/order/v1/callback' // 回调地址，用户微信通知消息
const private_key = fs.readFileSync(resolve(__dirname, '../apiclient_key.pem')).toString() // 秘钥，用于发起微信请求加密

const payment = new Payment({
    appid, mchid, private_key, serial_no, apiv3_private_key, notify_url
})

module.exports = { appid, mchid, private_key, serial_no, apiv3_private_key, notify_url, payment }