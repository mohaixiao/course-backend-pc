const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')
const RandomTool = require('../utils/RandomTool')
const SecretTool = require('../utils/SecretTool')
const GetUserInfoTool = require('../utils/GetUserInfoTool')
const { payment } = require('../config/wechatPay')
const dayjs = require('dayjs')
const redisConfig = require('../config/redisConfig')

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

    let token = req.headers.authorization.split(' ').pop()

    // 获取用户信息
    let userInfo = SecretTool.jwtVerify(token)

    // 用户的ip
    let ip = GetUserInfoTool.getIp(req)

    // 生成32位字符串
    let out_trade_no = RandomTool.randomString(32)

    // 根据商品的ID查询商品价格
    let productInfo = await DB.Product.findOne({ where: { id }, raw: true })

    // 拼装用户和商品信息插入数据库
    let userPro = {
      account_id: userInfo.id,
      username: userInfo.username,
      user_head_img: userInfo.head_img,
      out_trade_no: out_trade_no,
      total_amount: productInfo.amount,
      pay_amount: productInfo.amount,
      product_id: productInfo.id,
      product_type: productInfo.product_type,
      product_title: productInfo.title,
      product_img: productInfo.cover_img,
      order_state: 'NEW',
      ip: ip
    }

    // 新订单信息插入数据库
    await DB.ProductOrder.create(userPro)

    // 微信支付二维码
    if (type === 'PC') {
      let result = await payment.native({
        description: '小滴课堂-测试',
        out_trade_no,  // 正式
        amount: {
          // total: Number(productInfo.amount) * 100,  // 正式
          total: 1 // 测试
        }
      })
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
    let { out_trade_no, trade_state } = json
    console.log(json)
    if (trade_state === 'SUCCESS') {
      // 3.根据微信服务器返回的订单信息更新数据库中改订单的支付状态
      await DB.ProductOrder.update({ order_state: 'PAY' }, { where: { out_trade_no } })
      // 4.更新redis课程热门排行榜数据
      let productItem = await DB.ProductOrder.findOne({ where: { out_trade_no }, raw: true })
      let memberInfo = {
        id: productItem.id,
        title: productItem.product_title,
        img: productItem.product_img,
      }
      let time = dayjs(Date.now()).format('YYYY-MM-DD')
      await redisConfig.zincrby({ key: `${time}:rank:hot_product`, increment: 1, member: JSON.stringify(memberInfo) })
    }
    return BackCode.buildSuccess()
  },
  query_state: async (req) => {
    let { out_trade_no } = req.query
    let token = req.headers.authorization.split(' ').pop()
    let userInfo = SecretTool.jwtVerify(token)
    let order_state = (await DB.ProductOrder.findOne({ where: { out_trade_no, account_id: userInfo.id }, raw: true })).order_state
    return BackCode.buildSuccessAndData({ data: { order_state } })
  },
}
module.exports = OrderService