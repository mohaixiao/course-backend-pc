const Redis = require('ioredis')

const redis = new Redis({
        port: 6379, // Redis port
        host: '8.130.120.189',// Redis host
        // username: "default", // needs Redis >= 6
        password: 'xdclass.net',
        // db: 0, // Defaults to 0
    });


const redisConfig = {
    // redis存数据
    set: (key, value, time) => {
        time ? redis.set(key, value, 'EX', time) : redis.set(key, value)
    },

    // redis获取数据
    get: (key) => {
        return redis.get(key)
    },

    // redis删除数据
    del: (key) => {
        redis.del(key)
    },

    // redis判断数据是否存在
    exists: (key) => {
        return redis.exists(key)
    }
}

module.exports = redisConfig