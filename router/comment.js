const express = require('express');
const router = express.Router();
const CommentController = require('../controller/CommentController');

// 课程评论列表
router.post('/page', CommentController.page);

module.exports = router;

