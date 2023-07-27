/**
 * @params register 注册接口
 * @params forget 设置密码接口
 * @params forget 登录接口
 */

const UserService = require('../service/UserService')

const UserController = {
    register: async (req, res) => {
        let { phone, code } = req.body
        let handleRes = await UserService.register(phone, code);
        res.send(handleRes);
    },
    forget: async (req, res) => {
        let handleRes = await UserService.forget(req)
        res.send(handleRes)
    },
    login: async (req, res) => {
        let handleRes = await UserService.login(req)
        res.send(handleRes)
    },
    detail: async (req, res) => {
        let handleRes = await UserService.detail(req)
        res.send(handleRes)
    },
    duration_record: async (req, res) => {
        let handleRes = await UserService.duration_record(req)
        res.send(handleRes)
    },
    play_record: async (req, res) => {
        let handleRes = await UserService.play_record(req)
        res.send(handleRes)
    },
    update_img: async (req, res) => {
        let handleRes = await UserService.update_img(req)
        res.send(handleRes)
    },
    update: async (req, res) => {
        let handleRes = await UserService.update(req)
        res.send(handleRes)
    },
}


module.exports = UserController