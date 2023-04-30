const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Product', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cover_img: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "封面图"
    },
    old_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      comment: "原价"
    },
    amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      comment: "现价"
    },
    summary: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: "概要"
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "详情"
    },
    product_type: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "商品类型，字典表"
    },
    uv: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "浏览人数"
    },
    buy_num: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "购物人数"
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "作者id"
    },
    course_level: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "课程等级"
    },
    hour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "时长"
    },
    episode_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "集数"
    },
    player: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "播放器，默认选择第一个，数组[aliyun，hw，tencent]"
    },
    tdk: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      comment: "SEO关键词"
    },
    ali_zip_url: {
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "阿里云盘资料，使用||分割地址和密码，空则不提供"
    },
    bd_zip_url: {
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "百度云盘资料，，使用||分割地址和密码，空则不提供"
    },
    note_url: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      comment: "在线笔记地址，后续使用md导出自带目录"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "是否删除，1是删除，0是未删除"
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    total_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "总分"
    },
    content_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "内容评分"
    },
    easy_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "简洁易懂"
    },
    logic_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "逻辑清晰"
    }
  }, {
    sequelize,
    tableName: 'product',
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
