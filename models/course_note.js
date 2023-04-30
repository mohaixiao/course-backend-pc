const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CourseNote', {
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
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "用户头像"
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "用户名称"
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
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "是否删除 0：未删除 1：已删除"
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
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "默认0,数字越大越靠前，精选笔记需要排前面"
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "创建时间"
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "修改时间"
    }
  }, {
    sequelize,
    tableName: 'course_note',
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
