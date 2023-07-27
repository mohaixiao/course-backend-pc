const DB = require("../config/sequelize")
const BackCode = require('../utils/BackCode')

const CommentService = {
    page: async (req) => {
        let { page, size, id } = req.body
        if (!(page && size && id)) {
            return BackCode.buildError({ msg: '缺少必要的参数' })
        }
        // findAndCountAll 方法是结合了 findAll 和 count ,同时获取评论列表和总数
        let { count, rows } = await DB.Comment.findAndCountAll({
            where: { product_id: id },
            order: [['gmt_create', 'DESC']],
            offset: Number((page - 1) * size),
            limit: Number(size)
        })
        // 计算总页数
        let total_page = null
        count / size == 0 ? (total_page = count / size) : (total_page = Math.ceil(count / size))
        return BackCode.buildSuccessAndData({ data: { current_data: rows, total_page: total_page, total_record: count } })
    },
}

module.exports = CommentService
