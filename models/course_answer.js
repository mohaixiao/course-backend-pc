const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CourseAnswer', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "内容"
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "用户id"
    },
    head_img: {
      type: DataTypes.STRING(526),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    uv: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "阅读数"
    },
    up: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "点赞数"
    },
    episode_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "集id"
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "视频id"
    },
    question_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "问题id"
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "修改时间"
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "创建时间"
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "数字越大越靠前"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "是否删除 0：未删除 1：已删除"
    }
  }, {
    sequelize,
    tableName: 'course_answer',
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
        name: "episode_id",
        using: "BTREE",
        fields: [
          { name: "episode_id" },
        ]
      },
      {
        name: "video_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "video_user",
        using: "BTREE",
        fields: [
          { name: "account_id" },
          { name: "product_id" },
        ]
      },
    ]
  });
};
