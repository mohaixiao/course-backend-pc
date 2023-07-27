const express = require('express');
const router = express.Router();
const BarrageController = require('../controller/BarrageController');

// 发弹幕
router.post('/add', BarrageController.add);

// 获取集弹幕
router.post('/list_by_episode', BarrageController.list_by_episode);

module.exports = router;

