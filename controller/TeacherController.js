/**
 * @param {*} list 视频卡片接口
 */

const TeacherService = require('../service/TeacherService')
const TeacherController = {
    list: async (req, res) => {
        const handleRes = await TeacherService.list()
        res.send(handleRes)
    }
}
module.exports = TeacherController