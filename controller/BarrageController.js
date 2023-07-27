/**
 * @param {*} add 发弹幕
 * @param {*} list_by_episode 集弹幕
 */

const BarrageServie = require('../service/BarrageService')

const BarrageController = {
    add: async (req, res) => {
        let handleRes = await BarrageServie.add(req)
        res.send(handleRes);
    },
    list_by_episode: async (req, res) => {
        let handleRes = await BarrageServie.list_by_episode(req)
        res.send(handleRes);
    },
}
module.exports = BarrageController
