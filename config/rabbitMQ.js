const amqplib = require('amqplib')

class RabbitMQTool {
    constructor() {
        this.config = { hostname: '120.25.3.72', protocol: 'amqp', port: 5672, username: 'admin', password: 'password', vhost: '/' }
    }

    // 消息推送
    async sender(queue, msg) {
        // 创建一个 RabbitMQ 的连接 conn
        const conn = await amqplib.connect(this.config)
        // 创建一个通道 ch2，用于后续的消息推送
        const rabbitCreate = await conn.createChannel()
        // 将消息推送到指定的队列 queue 中，将消息内容转换为 Buffer 对象并传入
        rabbitCreate.sendToQueue(queue, Buffer.from(msg))
    }
}

module.exports = RabbitMQTool
