const axios = require('axios');

const sendMsgCode = (phone, randomCode) => {
    return axios({
        method: "post",
        url: 'https://api-v2.xdclass.net/send_sms',
        data: {
            appid: "KNZ912jGt1okfUY9j4",
            appSecret: "G6nhJyj6PbQ31UL6eeFkwTYGd4SMpV6U",
            code: randomCode,
            phoneNum: phone,
            templateCode: "SMS_168781429"
        }
    })
}

module.exports = sendMsgCode;