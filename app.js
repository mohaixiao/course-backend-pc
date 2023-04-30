const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey')
const DB = require('./config/sequelize')


app.use(cors())

// 解析json数据格式
app.use(bodyParser.json())

// 解析urlencoded数据格式
app.use(bodyParser.urlencoded({ extended: false }))

// 用户认证中间件
app.use(jwt({ secret: jwtSecretKey, algorithms: ['HS256'] }).unless({
  path: [
    /^\/api\/user\/v1\/register/,
    '/test'
  ]
}))

app.get('/test', async (req, res) => {
  const resData = await DB.Account.findAll()
  res.send(resData)
})


// 错误中间件
app.use((err, req, res, next) => {
  // 未登录的错误
  if (err.name === 'UnauthorizedError') {
    return res.send({ code: -1, data: null, msg: '请先登录！' })
  }
  // 其他的错误
  res.send({ code: -1, data: null, msg: err.message })
})


app.listen(8081, () => {
  console.log('服务启动在：http://127.0.0.1:8081')
})