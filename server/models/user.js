"use strict";
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/db_cost");
/* connect db status*/
db.connection.on('error', function (err) {
  console.log("database connect fail:" + err);
});
db.connection.on('open', function () {
  console.log("database connect success");
});
/* end */

/* the Schema about the common user  存在不足 待改进*/
var UserSchema = new mongoose.Schema({
  name: {type: String, trim: true, require: true},
  username: {type: String, unique: true, require: true, trim: true},
  password: {type: String, require: true},
  admin: {type: Boolean, default: false},
  date: {type: Date, default: Date.now},
  money: {type: Number, default: 0},
  accounts: [{
    status: {type: Number, require: true},
    date: {type: Date, require: true},
    thing: {type: String, require: true},
    money: {type: Number, require: true}
  }]
})

//经过研究思考 这边实际上 应该用范式的,但是时间太赶 实在没办法了



/*end */

//statics 扩展
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({username: username}).exec();
}

UserSchema.statics.addAccount = function(username,account){
  return this.findOneAndUpdate({username:username},{"accounts":account}).exec();
}

// UserSchema.statics.delAccount = function (username,) {
//
// }

/* UserSchema >> UserModel */
var UserModel = db.model('user', UserSchema);
/* end */

module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;
