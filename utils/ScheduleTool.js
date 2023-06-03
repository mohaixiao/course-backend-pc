// 定时任务工具
const schedule = require('node-schedule')

let rule = new schedule.RecurrenceRule()

class ScheduleTool {
    // 每天凌晨0点执行
    static dayJob(handle) {
        rule.hour = 0
        schedule.scheduleJob(rule, handle)
    }
}

module.exports = ScheduleTool