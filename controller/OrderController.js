/**
 * @param query_pay 查询课程是否购买接口
 * @param latest 查询课程最近购买动态接口
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
    }
}

module.exports = OrderController