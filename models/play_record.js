const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayRecord', {
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
    current_episode_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "对应的episode主键id，用来获取当前集的播放"
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户主键"
    },
    learn_ids: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      defaultValue: "\"\"",
      comment: "已经学的集id集合[1,32,42]，数组长度，是进度百分比"
    },
    pay_status: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: "支付状态，new免费记录，pay付费记录"
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
    }
  }, {
    sequelize,
    tableName: 'play_record',
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
