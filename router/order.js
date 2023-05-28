const express = require('express')
const router = express.Router()
const OrderController = require('../controller/OrderController.js')

// 查询课程是否购买接口
router.get('/query_pay', OrderController.query_pay)

// 查询课程是否最近购买动态接口
router.get('/latest', OrderController.latest)

// 获取微信支付二维码
router.post('/pay', OrderController.pay)

module.exports = router