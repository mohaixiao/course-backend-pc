const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Comment', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "内容"
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    head_img: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "用户头像"
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "昵称"
    },
    up: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "点赞数"
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "订单id"
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "商品id"
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
    total_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 8.88,
      comment: "评分，10分满分"
    },
    content_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 8.80,
      comment: "内容实用评分"
    },
    easy_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 8.80,
      comment: "简洁易懂评分"
    },
    logic_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 8.80,
      comment: "逻辑评分"
    },
    del: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "逻辑删除"
    }
  }, {
    sequelize,
    tableName: 'comment',
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
