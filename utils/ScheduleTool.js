// 定时任务工具
const schedule = require('node-schedule')

let rule = new schedule.RecurrenceRule()

class ScheduleTool {
    // 每天定时执行
    static dayJob(time, handle) {
        rule.hour = time
        schedule.scheduleJob(rule, handle)
    }
}

module.exports = ScheduleTool