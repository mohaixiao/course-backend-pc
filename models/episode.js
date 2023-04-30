const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Episode', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "集标题"
    },
    ordered: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "顺序，章里面的顺序"
    },
    hwyun_id: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "华为云id"
    },
    aliyun_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "阿里云视频id"
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "章节主键id"
    },
    duration: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "时长 分钟，单位"
    },
    free: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0表示免费，1表示付费"
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "视频id"
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
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "更新时间"
    }
  }, {
    sequelize,
    tableName: 'episode',
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
