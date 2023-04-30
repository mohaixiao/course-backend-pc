const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BulletScreen', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "视频id"
    },
    episode_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "集id"
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    head_img: {
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "头像"
    },
    username: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: "昵称"
    },
    content: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "内容"
    },
    style: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "样式 plain、vip会员、custom自定义"
    },
    play_time: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "集播放第几分钟,秒为单位"
    },
    source_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "10",
      comment: "内容来源 account、official"
    },
    target_url: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "可以点击跳转"
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
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0是未删除，1是已经删除"
    }
  }, {
    sequelize,
    tableName: 'bullet_screen',
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
    ]
  });
};
