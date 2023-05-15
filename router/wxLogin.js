const express = require('express')
const router = express.Router()
const WxLoginController = require('../controller/WxLoginController.js')

// 注册接口
router.get('/callback', WxLoginController.wechat_insert)




module.exports = router