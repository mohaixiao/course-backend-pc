/**
 * @param {*} page 课程评论列表
 */

const CommentService = require('../service/CommentService')

const CommentController = {
    page: async (req, res) => {
        let handleRes = await CommentService.page(req)
        res.send(handleRes)
    },
}
module.exports = CommentController