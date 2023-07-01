

const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')

// 注册接口
router.post('/register', UserController.register);

// 忘记密码
router.post('/forget', UserController.forget);

// 账号密码登录接口
router.post('/login', UserController.login)

// 用户信息接口
router.get('/detail', UserController.detail)

// 上报学习时长
router.post('/duration_record', UserController.duration_record)

module.exports = router;