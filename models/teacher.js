const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "昵称"
    },
    profile: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "简介"
    },
    head_img: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      comment: "头像"
    },
    wechat_qrcode: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "微信二维码"
    },
    pay_qrcode: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "打赏二维码"
    },
    point: {
      type: DataTypes.DOUBLE(10,2),
      allowNull: true,
      comment: "评分"
    },
    remark: {
      type: DataTypes.STRING(4056),
      allowNull: true,
      comment: "讲师入驻信息-不对外展示"
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      comment: "手机号",
      unique: "phone"
    },
    online: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: "0",
      comment: "off是未审核下线，on是已经审核上线"
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'teacher',
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
        name: "phone",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
    ]
  });
};
