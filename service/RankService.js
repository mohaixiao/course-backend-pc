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
    },
    duration: async () => {
        // 1.查询redis中是否有近七天的排行榜
        if (await exists('rank:duration')) {
            let rankListRedis = await get('rank:duration')
            return BackCode.buildSuccessAndData({ data: JSON.parse(rankListRedis) })
        }
        // 2.查询近七天学习的用户时长
        let rankSql = `select account_id,sum(duration)/60 as minute from duration_record where gmt_modified between ? and ? group by account_id order by minute desc limit ?`
        let rankListQuery = [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), 15]
        let rankList = await DB.sequelize.query(rankSql, { replacements: rankListQuery, type: QueryTypes.SELECT })
        // 3.查询用户的信息
        let idList = rankList.map((item) => item.account_id)
        let userInfoList = await DB.Account.findAll({
            attributes: ['id', 'username', 'head_img'],
            where: { id: { [Op.in]: idList } },
            raw: true
        })
        // 4.将用户的信息和观看总时长合并
        userInfoList.map((item) => {
            rankList.map((subItem) => {
                if (subItem.account_id === item.id) {
                    item['minute'] = subItem.minute
                    return item
                }
            })
        })
        // 5.兜底数据
        userInfoList = userInfoList.concat(rankDuration.list).slice(0, 15)
        set('rank:duration', JSON.stringify(userInfoList), 604800)
        return BackCode.buildSuccessAndData({ data: userInfoList })
    },
}
module.exports = RankService


