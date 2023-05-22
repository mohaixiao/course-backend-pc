const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')
const { Op } = require('sequelize')

const ProductService = {
    category: async () => {
        // // 无关联查询实现方案
        // let parentList = await DB.Category.findAll({ where: { pid: 0 }, order: [['id']], raw: true })
        // let childList = await DB.Category.findAll({ where: { pid: { [Op.ne]: 0 } }, order: [['id']], raw: true })
        // parentList.map((item) => {
        //   item['subCategoryList'] = []
        //   childList.map((subItem) => {
        //     if (subItem.pid === item.id) {
        //       return item.subCategoryList.push(subItem)
        //     }
        //   })
        // })
        // return BackCode.buildSuccessAndData({ data: parentList })

        // 关联查询
        let categoryList = await DB.Category.findAll({
            where: { pid: 0 },
            order: [['id']],
            include: [{ model: DB.Category, as: 'subCategoryList' }]
        })
        return BackCode.buildSuccessAndData({ data: categoryList })
    },
    card: async () => {
        let cardList = await DB.ProductCard.findAll({ raw: true })
        let list = cardList.map(async (item) => {
            item.product_list = await DB.Product.findAll({ where: { id: item.product_list.split(',') }, raw: true })
            return item
        })
        let lastList = await Promise.all(list)
        return BackCode.buildSuccessAndData({ data: lastList })
    },
    query_by_cid: async (req) => {
        let { cpid, cid, page, size } = req.body
        if (!(page && size)) return BackCode.buildError({ msg: '缺少必要的参数' })

        // 当前从第几个算起
        page = (page - 1) * size

        // 判断分类和方向是否为空
        let sqlId = cid || cpid || null

        // 原始的关联查询课程列表
        let productListSql = `SELECT p.id,p.cover_img,p.title,p.course_level,p.buy_num,p.old_amount,p.amount FROM product p LEFT JOIN category_product c ON c.product_id=p.id ${sqlId ? 'WHERE c.category_id=?' : ''} ORDER BY p.gmt_create DESC LIMIT ?,?`

        // 传递几个参数进sql判断
        let productListQuery = sqlId ? [sqlId, page, size] : [page, size]

        // sequelize原始查询
        let productList = await DB.sequelize.query(productListSql, {
            replacements: productListQuery,
            type: QueryTypes.SELECT
        })

        // 通过子查询课程总数
        let totalSql = `select count(*) as total_record from (SELECT p.id,p.cover_img,p.title,p.course_level,p.buy_num,p.old_amount,p.amount FROM product p LEFT JOIN category_product c ON c.product_id=p.id ${sqlId ? 'WHERE c.category_id=?' : ''}) temp_table`

        // sequelize原始查询总数
        let totalRes = await DB.sequelize.query(totalSql, {
            replacements: [sqlId],
            type: QueryTypes.SELECT
        })

        // 总数
        let total_record = totalRes[0].total_record

        // 计算总页数
        let total_page = null
        total_record / size == 0 ? (total_page = total_record / size) : (total_page = Math.ceil(total_record / size))

        return BackCode.buildSuccessAndData({ data: { current_data: productList, total_page, total_record } })
    }
}
module.exports = ProductService