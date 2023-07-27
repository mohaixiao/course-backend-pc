const huaWeiYun = require('../config/huaweicloud')
const SecretTool = require('../utils/SecretTool')
const CodeEnum = require('../utils/codeEnum')
const DB = require("../config/sequelize")
const BackCode = require('../utils/BackCode')

const getPlayUrlService = {
    get_play_url: async (req) => {
        const { episodeId, token } = req

        if (!(episodeId && token)) {
            return BackCode.buildError({ msg: '缺少必传参数' })
        }

        // 获取集数据
        let episode = await DB.Episode.findOne({ where: { id: episodeId }, raw: true })
        console.log(episode);
        if (!episode) {
            return BackCode.buildResult(CodeEnum.COURSE_VIDEO_NO_EXIST)
        }
        // 获取用户信息
        let tokenUser = SecretTool.jwtVerify(token)

        // 判断当前集是否购买过
        let order = await DB.ProductOrder.findOne({ where: { account_id: tokenUser.id, product_id: episode.product_id } })
        if ((!order) && episode.free === 1) {
            return BackCode.buildResult(CodeEnum.COURSE_VIDEO_NO_PERMISSION)
        }

        // 更新播放记录 - 查看用户和课程是否有播放记录


        // 传入视频媒资id获取播放地址
        let url = await huaWeiYun.getVideoUrl(episode.hwyun_id)

        if (url.length < 0) {
            return BackCode.buildResult(CodeEnum.COURSE_VIDEO_NO_EXIST)
        }

        return BackCode.buildSuccessAndData({ data: { playResult: url[0], episodeId: episodeId } })
    }
}

module.exports = getPlayUrlService