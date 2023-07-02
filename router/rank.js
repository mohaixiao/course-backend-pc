const express = require('express');
const router = express.Router();
const RankController = require('../controller/RankController');

// 商品排行榜
router.get('/hot_product', RankController.hot_product);

// 卷王排行榜
router.get('/duration', RankController.duration);

module.exports = router;

