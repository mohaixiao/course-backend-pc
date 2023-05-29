const { payment } = require('./config/wechatPay');

(async () => {
    let wechatOrderInfo = await payment.getTransactionsByOutTradeNo({ out_trade_no: '123jn12j3h191u23' })
    console.log(wechatOrderInfo.data)
})()