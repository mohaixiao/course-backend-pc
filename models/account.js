const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Account', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "昵称"
    },
    head_img: {
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "头像"
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "手机号",
      unique: "idx_phone"
    },
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "密码"
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "职位"
    },
    slogan: {
      type: DataTypes.STRING(524),
      allowNull: true,
      defaultValue: "全栈工程师",
      comment: "用户签名"
    },
    sex: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: "1",
      comment: "男，女"
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "城市"
    },
    role: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: "用户角色，字典表,common, year_vip,forever_vip"
    },
    learn_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "学习时长，单位小时"
    },
    vip_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "vip排名"
    },
    vip_expired: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "会员过期时间，永久会员配置2099年"
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "创建时间"
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    disabled: {
      type: DataTypes.STRING(16),
      allowNull: true,
      comment: "是否冻结 on off"
    },
    openid: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    unionid: {
      type: DataTypes.STRING(128),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'account',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_phone",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
    ]
  });
};
