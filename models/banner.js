const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Banner', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    location: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "格式页面-位置-模块：\n\thome_swiper_banner 首页轮播图\n\thome_top_ad 首页顶部轮播图\n\thome_floor_ad 首页底部浮动广告\n\tlist_right_banner 列表页右上角轮播图\n\tdetail_rightn_banner 播放页右边轮播图"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "录播图中文名称"
    },
    img_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: "图片列表，逗号分隔"
    },
    pc_link: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: "PC端跳转链接，逗号分隔"
    },
    h5_link: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: "H5端跳转连接，逗号分隔"
    },
    expired: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "展现条件，once一次，forever永久"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "是否删除，1是删除，0是未删除"
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
    tableName: 'banner',
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
        name: "uk_loca",
        using: "BTREE",
        fields: [
          { name: "location" },
        ]
      },
    ]
  });
};
