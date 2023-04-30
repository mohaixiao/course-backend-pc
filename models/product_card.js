const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProductCard', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "标题，如热门视频"
    },
    summay: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "副标题"
    },
    row_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "几行"
    },
    column_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "几列"
    },
    product_list: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "视频列表"
    },
    card_type: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "卡片类型，video、page"
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "图标"
    },
    weight: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: "权重,数字越大排越前"
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
    tableName: 'product_card',
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
