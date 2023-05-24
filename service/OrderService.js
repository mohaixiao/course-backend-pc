const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')
const SecretTool = require('../utils/SecretTool')

const OrderService = {
  query_pay: async (req) => {
    let { id } = req.query
    if (!id) return BackCode.buildError({ msg: '缺少必要参数' })
    let token = req.headers.authorization.split(' ').pop()
    let userInfo = SecretTool.jwtVerify(token)
    let orderList = await DB.ProductOrder.findAll({
      where: { product_id: id, account_id: userInfo.id, order_state: 'PAY' },
      raw: true
    })
    if (orderList.length > 0) {
      return BackCode.buildSuccess()
    } else {
      return BackCode.buildResult(CodeEnum.PRODUCT_NO_PAY)
    }
  },
  latest: async (req) => {
    let { id } = req.query
    if (!id) return BackCode.buildError({ msg: '缺少必要参数' })
    let latestList = await DB.ProductOrder.findAll({
      where: { product_id: id },
      order: [['gmt_create', 'DESC']],
      limit: 20
    })
    return BackCode.buildSuccessAndData({ data: latestList })
  }
}
module.exports = OrderService