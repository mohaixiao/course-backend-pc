class GetUserInfoTool {
    // 获取用户的ip
    static getIp(req) {
        let ip = req.ip.match(/\d+.\d+.\d+.\d+./).join('.')
        return ip
    }
    // 获取用户的设备
    static getUseragent(req) {
        let useragent = req.headers['user-agent']
        return useragent
    }
}

module.exports = GetUserInfoTool