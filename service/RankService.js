const dayjs = require('dayjs')
const { zrevrange } = require('../config/redisConfig')
const rankProduct = require('../mock/rankProduct.json')
const BackCode = require('../utils/BackCode')

const RankService = {
    hot_product: async () => {
        let time = dayjs().format('YYYY-MM-DD')
        // 获取redis当中的课程销量列表
        let result = await zrevrange({ key: `${time}:rank:hot_product`, start: 0, stop: 14 })
        // 兜底数据
        let list = result.map((item) => JSON.parse(item)).concat(rankProduct.list).slice(0, 15)
        return BackCode.buildSuccessAndData({ data: list })
    }
}
module.exports = RankService


