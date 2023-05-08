const DB = require('../config/sequelize')
const redisConfig = require('../config/redisConfig');
const RandomTool = require('../utils/RandomTool');
const SecretTool = require('../utils/SecretTool');

const UserService = {
    register: async (phone, code) => {
        // 手机号注册查重的逻辑 
        let existPhone = await DB.Account.findAll({ where: { phone } });
        if (existPhone.length > 0) {
            return { code: -1, msg: '手机号已经注册' }
        }

        //  获取redis缓存的code,判断用户code是否正确 
        if (await redisConfig.exists('register:code:' + phone)) {
            const codeRes = redisConfig.get('register:code:' + phone);
            if (codeRes !== code) {
                return { code: -1, msg: '短信验证码不正确' }
            } else {
                return { code: -1, msg: '请先获取短信验证码' }
            }
        }

        //  随机获取头像、用户名 
        let avatar = RandomTool.randomAvatar();
        let name = RandomTool.randomName();

        // 加密生成token 7天过期
        let user = { avatar, name, phone }
        let token = SecretTool.jwtSign(user, '168h');

        // 用户信息插入数据库
        await DB.Account.create({ username: name, head_img: avatar, phone })

        return { code: 0, data: `Bearer ${token}` }
    }
}

module.exports = UserService;