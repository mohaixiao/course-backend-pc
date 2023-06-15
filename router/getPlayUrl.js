const express = require('express');
const router = express.Router();
const getPlayUrlController = require('../controller/getPlayUrlController');

// 视频播放凭证
router.post('/get_play_url', getPlayUrlController.get_play_url);

module.exports = router;

