/**
 * @param {*} hot_product 商品排行榜
 */

const RankService = require('../service/RankService')

const RankController = {
  hot_product: async (req, res) => {
    let handleRes = await RankService.hot_product(req)
    res.send(handleRes)
  }
}

module.exports = RankController