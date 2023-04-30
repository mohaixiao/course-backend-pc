const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProductOrder', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "",
      comment: "微信昵称"
    },
    user_head_img: {
      type: DataTypes.STRING(524),
      allowNull: true,
      comment: "微信头像"
    },
    out_trade_no: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "商家订单唯一标识"
    },
    transaction_no: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "支付平台订单唯一标识"
    },
    order_state: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "new是新订单未支付，pay表示已支付,cancel是取消"
    },
    total_amount: {
      type: DataTypes.DECIMAL(11,2),
      allowNull: true,
      comment: "支付金额，单位分"
    },
    pay_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      comment: "订单实际金额，单位分"
    },
    pay_type: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "支付类型,wechat，alipay, hbfq_3,hbfq_6,hbfq_12"
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "视频主键"
    },
    product_type: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "商品类型，字典表"
    },
    product_title: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "视频名称"
    },
    product_img: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "视频图片"
    },
    ip: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "用户ip地址"
    },
    is_comment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "是否评论，0表示未评论，1表示已经评论"
    },
    discount_type: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "折扣类型NO 是没有，coin是D币，coupon是优惠券，vip_discount是会员折扣，new_user_welware新用户福利"
    },
    discount_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      comment: "折扣金额"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0表示未删除，1表示已经删除"
    },
    notify_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "支付回调时间"
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "订单生成时间"
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'product_order',
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
