const axios = require('axios');

const sendMsgCode = (phone, randomCode) => {
    return axios({
        method: "post",
        url: 'https://api-v2.xdclass.net/send_sms',
        data: {
            appid: "Ek7blIsBmbSfMjjUjK",
            appSecret: "nPibND8mtAksFyQzmEbZkcG7yIp8oSt8",
            code: randomCode,
            phoneNum: phone,
            templateCode: "SMS_168781429"
        }
    })
}

module.exports = sendMsgCode;