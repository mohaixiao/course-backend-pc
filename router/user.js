

const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')
const multer = require('multer')
const upload = multer({ dest: 'tempImg/' })

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

// 用户播放记录
router.post('/play_record', UserController.play_record)

// 个人头像修改
router.post('/update_img', upload.single('headImg'), UserController.update_img)

// 个人资料修改
router.post('/update', UserController.update)

module.exports = router;