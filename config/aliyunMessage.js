const axios = require('axios');

const sendMsgCode = (phone, randomCode) => {
    return axios({
        method: "post",
        url: 'https://api-v2.xdclass.net/send_sms',
        data: {
            appid: "Ek7blIsBmbSfMjjUjK",
            appSecret: "Vwqd07rdbhCSpc6DfGZjyy1zCkfhJnYE",
            code: randomCode,
            phoneNum: phone,
            templateCode: "SMS_168781429"
        }
    })
}

module.exports = sendMsgCode;