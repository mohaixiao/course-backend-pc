/**
 * @param query_pay 查询课程是否购买接口
 * @param latest 查询课程最近购买动态接口
 * @param pay PC微信支付二维码 
 * @param callback 微信回调
 * @param query_state 轮询用户扫码与否
 */

const OrderService = require('../service/OrderService.js')

const OrderController = {
    query_pay: async (req, res) => {
        let handleRes = await OrderService.query_pay(req)
        res.send(handleRes)
    },
    latest: async (req, res) => {
        let handleRes = await OrderService.latest(req)
        res.send(handleRes)
    },
    pay: async (req, res) => {
        let handleRes = await OrderService.pay(req)
        res.send(handleRes);
    },
    callback: async (req, res) => {
        let handleRes = await OrderService.callback(req);
        res.send(handleRes);
    },
    query_state: async (req, res) => {
        let handleRes = await OrderService.query_state(req);
        res.send(handleRes)
    },
}

module.exports = OrderController