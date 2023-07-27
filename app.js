const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey')
const DB = require('./config/sequelize')
const BackCode = require('./utils/BackCode')
const CodeEnum = require('./utils/CodeEnum')
const ScheduleTool = require('./utils/ScheduleTool')
const dayjs = require('dayjs')
const RabbitMQTool = require('./config/rabbitMQ')
const { payment } = require('./config/wechatPay')
const { Op } = require('sequelize')
const redisConfig = require('./config/redisConfig')
const { createServer } = require('http');
const websocket = require('./config/websocket')
const server = createServer(app)
websocket(server)


app.use(cors())

// 解析json数据格式
app.use(bodyParser.json())

// 解析urlencoded数据格式
app.use(bodyParser.urlencoded({ extended: false }))

// 用户认证中间件
app.use(jwt({ secret: jwtSecretKey, algorithms: ['HS256'] }).unless({
  path: [
    /^\/api\/notify\/v1/,  // 验证码通知接口排除
    /^\/api\/user\/v1\/register/,  // 注册接口排除
    /^\/api\/user\/v1\/login/,  // 登录接口排除
    /^\/api\/user\/v1\/forget/,  // 设置密码接口排除
    /^\/api\/wx_login\/v1/,  // 微信登录接口排除
    /^\/api\/banner\/v1/,  // 轮播图接口排除
    /^\/api\/product\/v1/,  // 课程视频接口排除
    /^\/api\/teacher\/v1/,  // 讲师接口排除
    /^\/api\/order\/v1\/latest/,  // 课程购买动态接口排除
    /^\/api\/comment\/v1\/page/,  // 评论列表
    /^\/api\/order\/v1\/callback/,  // 微信支付回调接口
    /^\/api\/rank\/v1/,  //排行榜
    /^\/api\/barrage\/v1\/list_by_episode/, //视频弹幕
  ]
}))
// 弹幕相关接口
const barrageController = require('./router/barrage');
app.use('/api/barrage/v1', barrageController);

// 视频播放的接口
const getPlayUrlRouter = require('./router/getPlayUrl');
app.use('/api/getPlayUrl/v1', getPlayUrlRouter);

// 榜单相关的接口
const rankRouter = require('./router/rank');
app.use('/api/rank/v1', rankRouter);

// 通知相关的接口
const notifyRouter = require('./router/notify.js')
app.use('/api/notify/v1', notifyRouter)

// 用户相关的接口
const userRouter = require('./router/user.js')
app.use('/api/user/v1', userRouter)

// 微信登录相关的接口
const wxLoginRouter = require('./router/wxLogin.js')
app.use('/api/wx_login/v1', wxLoginRouter)

// banner接口
const bannerRouter = require('./router/banner.js')
app.use('/api/banner/v1', bannerRouter)

// 视频课程接口
const productRouter = require('./router/product.js')
app.use('/api/product/v1', productRouter)

// 讲师相关的接口
const teacherRouter = require('./router/teacher');
app.use('/api/teacher/v1', teacherRouter);

// 订单相关的接口
const orderRouter = require('./router/order.js')
app.use('/api/order/v1', orderRouter)

// 评论相关的接口
const commentRouter = require('./router/comment');
app.use('/api/comment/v1', commentRouter);


// 每天凌晨0点清除昨天redis中商品热卖排行榜的数据
ScheduleTool.dayJob(0, () => {
  let yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  redisConfig.del(`${yesterday}:rank:hot_product`)
})


// 每天凌晨2点更新统计昨天用户观看视频时长
ScheduleTool.dayJob(2, async () => {
  // 1.计算昨日的日期
  let yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  // 2.统计昨天有观看视频的用户，并且去重
  let onlyRecord = await DB.DurationRecord.findAll({ attributes: [[DB.sequelize.fn('DISTINCT', DB.sequelize.col('account_id')), 'accountId']], where: { gmt_modified: { [Op.gt]: yesterday } }, raw: true })
  // 3.根据用户id计算每个用户总观看时长
  let itemRecord = onlyRecord.map(async (item) => {
    item['duration'] = await DB.DurationRecord.sum('duration', { where: { account_id: item.accountId } })
    return item
  })
  // 4.转成普通数组
  let itemRecordList = await Promise.all(itemRecord)
  // 5.遍历每个用户更新总观看时长
  itemRecordList.map(async (item) => {
    await DB.Account.update({ learn_time: item.duration }, { where: { id: item.accountId } })
  })
});



// 订单超时关单，监听MQ死信队列
const rabbitMQ = new RabbitMQTool()
const closerOrder = async (msg) => {
  let out_trade_no = JSON.parse(msg.content).out_trade_no
  // 1.查询数据库订单是否支付
  let orderItem = await DB.ProductOrder.findOne({ where: { out_trade_no }, raw: true })
  if (orderItem.order_state === 'NEW') {
    // 2.去微信支付平台二次确认
    let wechatOrder = await payment.getTransactionsByOutTradeNo({ out_trade_no })
    if (JSON.parse(wechatOrder.data).trade_state === 'NOTPAY') {
      // 3.如果未支付，order_state改为CANCEL
      await DB.ProductOrder.update({ order_state: 'CANCEL' }, { where: { out_trade_no } })
    } else if (JSON.parse(wechatOrder.data).trade_state === 'SUCCESS') {
      // 4.如果已支付，order_state改为PAY
      await DB.ProductOrder.update({ order_state: 'PAY' }, { where: { out_trade_no } })
    }
  }
}
rabbitMQ.listener('dead.order.queue', closerOrder)


// 错误中间件
app.use((err, req, res, next) => {
  // 未登录的错误
  if (err.name === 'UnauthorizedError') {
    return res.send(BackCode.buildResult(CodeEnum.ACCOUNT_UNLOGIN))
  }
  // 其他的错误
  res.send(BackCode.buildError({ msg: err.message }))
})


server.listen(8081, () => {
  console.log('服务启动在：http://127.0.0.1:8081')
})