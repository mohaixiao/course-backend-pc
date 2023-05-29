const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')
const RandomTool = require('../utils/RandomTool')
const SecretTool = require('../utils/SecretTool')
const { payment } = require('../config/wechatPay')

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
  },
  pay: async (req) => {
    let { id, type } = req.body

    // 生成32位字符串
    let out_trade_no = RandomTool.randomString(32)

    // 根据商品的ID查询商品价格
    let productInfo = await DB.Product.findOne({ where: { id }, raw: true })

    // 微信支付二维码
    if (type === 'PC') {
      let result = await payment.native({
        description: '小滴课堂-测试',
        // out_trade_no,  // 正式
        out_trade_no: '123jn12j3h191u23', // 测试
        amount: {
          // total: Number(productInfo.amount) * 100,  // 正式
          total: 1 // 测试
        }
      })
      console.log(result)
      return BackCode.buildSuccessAndData({ data: { code_url: JSON.parse(result.data).code_url, out_trade_no } })
    }

  },
  callback: async (req) => {
    let timestamp = req.header('Wechatpay-Timestamp')
    let nonce = req.header('Wechatpay-Nonce')
    let serial = req.header('Wechatpay-Serial')
    let signature = req.header('Wechatpay-Signature')
    let body = req.body

    // 1.校验收到的请求是否来自微信服务器和平台证书是否一致
    let result = await payment.verifySign({
      timestamp,
      nonce,
      serial,
      signature,
      body
    })
    if (!result) {
      return
    }

    // 2.解密body中的数据，拿到用户订单信息
    let bufferoOne = payment.decode(body.resource)
    let json = JSON.parse(bufferoOne.toString('utf8'))
    console.log(json)

    return BackCode.buildSuccess()
  },
}
module.exports = OrderService