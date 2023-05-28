const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey')
const DB = require('./config/sequelize')
const BackCode = require('./utils/BackCode')
const CodeEnum = require('./utils/CodeEnum')

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
    /^\/api\/comment\/v1\/page/,  //评论列表
    /^\/api\/order\/v1\/pay/,  //评论列表
  ]
}))

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

// 错误中间件
app.use((err, req, res, next) => {
  // 未登录的错误
  if (err.name === 'UnauthorizedError') {
    return res.send(BackCode.buildResult(CodeEnum.ACCOUNT_UNLOGIN))
  }
  // 其他的错误
  res.send(BackCode.buildError({ msg: err.message }))
})


app.listen(8081, () => {
  console.log('服务启动在：http://127.0.0.1:8081')
})