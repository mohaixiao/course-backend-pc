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
    }
}
module.exports = ProductService