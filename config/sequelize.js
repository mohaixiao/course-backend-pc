const { Sequelize } = require('sequelize')
const initModels = require('../models/init-models')

const sequelize = new Sequelize('xdclass-edu', 'root', 'xdclass.net168', {
    host: '8.130.120.189',
    dialect: 'mysql',
    timezone: '+08:00'
});

(async function () {
    try {
        await sequelize.authenticate()
        console.log('数据库链接成功')
    } catch (error) {
        console.log('数据库链接失败：', error)
    }
})()


const models = initModels(sequelize)

// category与自身表的一对多关系模型
models.Category.hasMany(models.Category, { foreignKey: 'pid', as: 'subCategoryList' })
models.Category.belongsTo(models.Category, { foreignKey: 'pid' })

module.exports = { ...models, sequelize }