const amqplib = require('amqplib')

class RabbitMQTool {
    constructor() {
        this.config = { hostname: '8.130.120.189', protocol: 'amqp', port: 5672, username: 'admin', password: 'password', vhost: '/' }
    }

    // 消息推送
    async sender(queue, msg) {
        const conn = await amqplib.connect(this.config)
        const rabbitCreate = await conn.createChannel()
        rabbitCreate.sendToQueue(queue, Buffer.from(msg))
    }

    // 监听mq消息
    async listener(queue, handle) {
        const conn = await amqplib.connect(this.config)
        const rabbitCreate = await conn.createChannel()
        // 确认队列
        await rabbitCreate.assertQueue(queue)
        rabbitCreate.consume(queue, (msg) => {
            if (msg !== null) {
                console.log('收到的消息：', JSON.parse(msg.content))
                // 传入到需要执行的函数中
                handle(msg)
                // 告诉rabbitMQ消息已经被消费
                rabbitCreate.ack(msg)
            } else {
                console.log('消费者被服务器取消')
            }
        })
    }
}

module.exports = RabbitMQTool