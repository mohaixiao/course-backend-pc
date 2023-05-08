class GetUserInfoTool {
    static getIP(req) {
        let ip = req.ip.match(/\d+.\d+.\d+.\d+./).join('.');
        return ip;
    }

    static GetUseragent(req) {
        let useragent = req.headers['user-agent'];
        return useragent;
    }
}

module.exports = GetUserInfoTool