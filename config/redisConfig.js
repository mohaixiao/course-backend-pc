const Reids = require('ioredis');

const redis = new Reids({
    port: 6379,
    host: "8.137.9.133",
    password: 'xdclass.net'
})

const redisConfig = {
    // redis存数据
    set: (key, value, time) => {
        time ? redis.set(key, value, 'EX', time) : redis.set(key, value)
    },
    // redis获取数据
    get: (key) => {
        return redis.get(key);
    }
}

module.exports = redisConfig;