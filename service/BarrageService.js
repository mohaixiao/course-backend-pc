const DB = require("../config/sequelize")
const SecretTool = require('../utils/SecretTool')
const { Op } = require('sequelize');
const BackCode = require('../utils/BackCode')

const BarrageService = {
    add: async (req) => {
        let { content, episodeId, playTime, productId } = req.body
        if (!(content && episodeId && Number(playTime) >= 0 && productId)) {
            return BackCode.buildError({ msg: '缺少必要参数' })
        }
        let token = req.headers.authorization.split(' ').pop()
        let userInfo = SecretTool.jwtVerify(token)
        let barrageItem = {
            episode_id: episodeId,
            product_id: productId,
            play_time: playTime,
            content: content,
            account_id: userInfo.id,
            head_img: userInfo.head_img,
            username: userInfo.username,
            del: 0,
        }
        await DB.BulletScreen.create(barrageItem)
        return BackCode.buildSuccess()
    },
    list_by_episode: async (req) => {
        let { beginTime, endTime, episodeId, productId } = req.body
        if (!(productId && episodeId && Number(beginTime) >= 0 && endTime)) {
            return BackCode.buildError({ msg: '缺少必要参数' })
        }
        // 查询视频指定时间段的弹幕
        let barrageList = await DB.BulletScreen.findAll({
            where: { play_time: { [Op.between]: [beginTime, endTime] }, episode_id: episodeId, product_id: productId }
        })
        return BackCode.buildSuccessAndData({ data: barrageList })
    },
}

module.exports = BarrageService