const DB = require('../config/sequelize')
const redisConfig = require('../config/redisConfig')
const RandomTool = require('../utils/RandomTool')
const SecretTool = require('../utils/SecretTool')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')

const UserService = {
    register: async (phone, code) => {
        // 手机号注册查重
        let existPhone = await DB.Account.findAll({ where: { phone } })
        if (existPhone.length > 0) {
            return BackCode.buildResult(CodeEnum.ACCOUNT_REPEAT)
        }

        // 获取redis中的验证码和用户传入的进行对比
        if (await redisConfig.exists('register:code:' + phone)) {
            let codeRes = (await redisConfig.get('register:code:' + phone)).split('_')[1]
            if (!(code == codeRes)) {
                return BackCode.buildError({ msg: '短信验证码不正确' })
            }
        } else {
            return BackCode.buildError({ msg: '请先获取短信验证码' })
        }

        // 随机生成头像和昵称
        let avatar = RandomTool.randomAvatar()
        let name = RandomTool.randomName()

        // 生成token 7天过期
        let user = { avatar, name, phone }
        let token = SecretTool.jwtSign(user, '168h')

        // 将用户信息插入数据库
        await DB.Account.create({ username: name, head_img: avatar, phone })
        return BackCode.buildSuccessAndData({ data: `Bearer ${token}` })
    },
    forget: async (req) => {
        let { phone, password, code } = req.body
        // 判断code在redis中是否存在
        let codeExist = await redisConfig.exists('change:code:' + phone)
        if (!codeExist) return BackCode.buildError({ msg: '请先获取手机验证码' })
        // 判断redis中code和用户code是否相等
        let codeRes = (await redisConfig.get('change:code:' + phone)).split('_')[1]
        if (!(code === codeRes)) return BackCode.buildError({ msg: '手机验证码不正确' })

        pwd = SecretTool.md5(password)
        await DB.Account.update({ pwd }, { where: { phone } })
        return BackCode.buildSuccessAndMsg({ msg: '修改成功' })
    },
    login: async (req) => {
        let { phone, password, code } = req.body
        // 参数判空
        if (!(phone && (password || code))) return BackCode.buildError({ msg: '缺少必要参数' })
        // 判断手机号是否注册
        let userInfo = await DB.Account.findAll({ where: { phone }, raw: true })
        if (userInfo.length === 0) return BackCode.buildResult(CodeEnum.ACCOUNT_UNREGISTER)

        // 账号密码方式
        if (password) {
            // 判断密码是否正确
            if (!(userInfo[0].pwd == SecretTool.md5(password))) {
                return BackCode.buildResult(CodeEnum.ACCOUNT_PWD_ERROR)
            }
        } else { // 验证码方式
            // 判断redis中是否有login的code
            let codeExist = await redisConfig.exists('login:code:' + phone)
            if (!codeExist) return BackCode.buildError({ msg: '请先获取手机验证码' })
            // redis中code和用户传如的code对比
            let codeRes = (await redisConfig.get('login:code:' + phone)).split('_')[1]
            if (!(codeRes == code)) return BackCode.buildError({ msg: '手机验证码不正确' })
        }
        // 拼接token的用户信息，除去密码
        let user = { ...userInfo[0], pwd: '' }
        //生成token
        let token = SecretTool.jwtSign(user, '168h')
        return BackCode.buildSuccessAndData({ data: `Bearer ${token}` })
    },
    detail: async (req) => {
        let token = req.headers.authorization.split(' ').pop()
        let userInfo = SecretTool.jwtVerify(token)
        let userDetail = await DB.Account.findOne({ where: { id: userInfo.id }, raw: true })
        return BackCode.buildSuccessAndData({ data: { ...userDetail, pwd: '' } })
    },
    duration_record: async (req) => {
        let { productId, episodeId, duration } = req.body
        if (!(productId && episodeId && duration)) {
            return BackCode.buildError({ msg: '缺少必要参数' })
        }
        let token = req.headers.authorization.split(' ').pop()
        let userInfo = SecretTool.jwtVerify(token)
        // 查询是否该用户的该章该集有上报过学习时长、有则更新学习时长、无则插入
        let isHas = await DB.DurationRecord.findOne({
            where: { account_id: userInfo.id, product_id: productId, episode_id: episodeId },
            raw: true
        })
        // 对比最新学习时长和之前的大小
        if (!(Number(duration) > Number(isHas.duration))) {
            return BackCode.buildError({ msg: '最新学习时长较之前小，不做更新' })
        }
        if (isHas) {
            await DB.DurationRecord.update(
                { duration: Number(duration) },
                { where: { account_id: userInfo.id, product_id: productId, episode_id: episodeId } }
            )
            return BackCode.buildSuccess()
        } else {
            await DB.DurationRecord.create({
                account_id: userInfo.id,
                product_id: productId,
                episode_id: episodeId,
                duration: duration
            })
            return BackCode.buildSuccess()
        }
    },
}

module.exports = UserService