class RandomTool {
    // 随机生成四位数字
    static randomCode() {
        return Math.floor((Math.random() * (9999 - 1000))) + 1000;
    }
}

module.exports = RandomTool;