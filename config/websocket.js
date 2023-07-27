const { Server } = require('socket.io')
const Redis = require("ioredis");
// redis发布的api
const clientPublish = new Redis({ port: 6379, host: '8.130.120.189', password: 'xdclass.net' });
// redis订阅api
const clientSubscribe = new Redis({ port: 6379, host: '8.130.120.189', password: 'xdclass.net' });

clientSubscribe.subscribe('chat');

const websocket = (server) => {
    // 实例化socket
    const io = new Server(server, { cors: { origin: '*' } })
    // websocket建立链接
    io.on('connection', (socket) => {
        console.log('有客户端链接进来了')
        // 监听bulletChat事件
        socket.on('bulletChat', (info) => {
            clientPublish.publish('chat', JSON.stringify(info))
        })
    })
    // 订阅redis收到消息后，执行websocket的消息推送客户端
    clientSubscribe.on('message', (channel, message) => {
        io.emit('message', JSON.parse(message))
    })
}

module.exports = websocket