var DataTypes = require("sequelize").DataTypes;
var _Account = require("./account");
var _Banner = require("./banner");
var _BulletScreen = require("./bullet_screen");
var _Category = require("./category");
var _CategoryProduct = require("./category_product");
var _Chapter = require("./chapter");
var _Comment = require("./comment");
var _CourseAnswer = require("./course_answer");
var _CourseNote = require("./course_note");
var _CourseQuestion = require("./course_question");
var _DurationRecord = require("./duration_record");
var _Episode = require("./episode");
var _Favorite = require("./favorite");
var _PlayRecord = require("./play_record");
var _Product = require("./product");
var _ProductCard = require("./product_card");
var _ProductOrder = require("./product_order");
var _Teacher = require("./teacher");

function initModels(sequelize) {
  var Account = _Account(sequelize, DataTypes);
  var Banner = _Banner(sequelize, DataTypes);
  var BulletScreen = _BulletScreen(sequelize, DataTypes);
  var Category = _Category(sequelize, DataTypes);
  var CategoryProduct = _CategoryProduct(sequelize, DataTypes);
  var Chapter = _Chapter(sequelize, DataTypes);
  var Comment = _Comment(sequelize, DataTypes);
  var CourseAnswer = _CourseAnswer(sequelize, DataTypes);
  var CourseNote = _CourseNote(sequelize, DataTypes);
  var CourseQuestion = _CourseQuestion(sequelize, DataTypes);
  var DurationRecord = _DurationRecord(sequelize, DataTypes);
  var Episode = _Episode(sequelize, DataTypes);
  var Favorite = _Favorite(sequelize, DataTypes);
  var PlayRecord = _PlayRecord(sequelize, DataTypes);
  var Product = _Product(sequelize, DataTypes);
  var ProductCard = _ProductCard(sequelize, DataTypes);
  var ProductOrder = _ProductOrder(sequelize, DataTypes);
  var Teacher = _Teacher(sequelize, DataTypes);


  return {
    Account,
    Banner,
    BulletScreen,
    Category,
    CategoryProduct,
    Chapter,
    Comment,
    CourseAnswer,
    CourseNote,
    CourseQuestion,
    DurationRecord,
    Episode,
    Favorite,
    PlayRecord,
    Product,
    ProductCard,
    ProductOrder,
    Teacher,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
