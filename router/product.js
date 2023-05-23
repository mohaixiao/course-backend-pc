const express = require('express')
const router = express.Router()
const ProductController = require('../controller/ProductController.js')

// 课程分类接口
router.get('/category', ProductController.category)

// 视频卡片接口
router.get('/card', ProductController.card);

// 分类查询视频接口
router.post('/query_by_cid', ProductController.query_by_cid);

// 视频详情接口
router.get('/detail', ProductController.detail);

// 视频资料接口
router.get('/material_by_id', ProductController.material_by_id);

// 某个视频章集接口
router.get('/chapter', ProductController.chapter);

module.exports = router