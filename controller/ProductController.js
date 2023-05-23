/**
 * @param category 课程分类接口
 * @param card 视频卡片接口
 * @param query_by_cid 分类查找视频接口
 * @param detail 视频详情接口
 * @param material_by_id 视频资料接口
 * @param chapter 获取课程章集
 */

const ProductService = require('../service/ProductService.js')

const ProductController = {
    category: async (req, res) => {
        let handleRes = await ProductService.category()
        res.send(handleRes)
    },
    card: async (req, res) => {
        let handleRes = await ProductService.card()
        res.send(handleRes)
    },
    query_by_cid: async (req, res) => {
        let handleRes = await ProductService.query_by_cid(req)
        res.send(handleRes)
    },
    detail: async (req, res) => {
        let handleRes = await ProductService.detail(req)
        res.send(handleRes)
    },
    material_by_id: async (req, res) => {
        let handleRes = await ProductService.material_by_id(req)
        res.send(handleRes)
    },
    chapter: async (req, res) => {
        let handleRes = await ProductService.chapter(req)
        res.send(handleRes)
    },
}

module.exports = ProductController