"use strict";
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/db_cost");

db.connection.on('error', function (err) {
  console.log("database connect fail:" + err);
});
db.connection.on('open', function () {
  console.log("database connect success");
});


/* the Schema about the common user */
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
    money: {type: Number, require: true},
    control:{type:String,default:0}
  }]
});

//经过研究思考 这边实际上 应该用范式的,但是时间太赶 实在没办法了


//statics 扩展
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({username: username}).exec();
};

UserSchema.statics.addAccount = function(username,account){
  return this.findOneAndUpdate({username:username},{"accounts":account}).exec();
};


/* UserSchema >> UserModel */
var UserModel = db.model('user', UserSchema);
/* end */

/* test data001*/
// var test = new UserModel({
//     name: "xiaoming",
//     username: "xiao",
//     password: "ming",
//     accounts: [{
//       status: 1,
//       date: "2017-03-23T02:30:24.837Z",
//       thing: "play",
//       money: 10
//     }, {
//       status: 1,
//       date: "2017-03-24T02:30:24.837Z",
//       thing: "sleep",
//       money: 20
//     }, {
//       status: 1,
//       date: "2017-03-25T02:30:24.837Z",
//       thing: "play",
//       money: 10
//     },
//       {
//         status: 2,
//         date: "2017-03-23T02:30:24.837Z",
//         thing: "play",
//         money: 10
//       }, {
//         status: 2,
//         date: "2017-03-24T02:30:24.837Z",
//         thing: "sleep",
//         money: 20
//       }, {
//         status: 2,
//         date: "2017-03-25T02:30:24.837Z",
//         thing: "play",
//         money: 10
//       },
//       {
//         status: 3,
//         date: "2017-03-23T02:30:24.837Z",
//         thing: "play",
//         money: 10
//       }, {
//         status: 3,
//         date: "2017-03-24T02:30:24.837Z",
//         thing: "sleep",
//         money: 20
//       }, {
//         status: 4,
//         date: "2017-03-25T02:30:24.837Z",
//         thing: "play",
//         money: 10
//       }]
//   }
// );
//
// test.save(function (err, log) {
//   if (err) {
//     console.log('save error:' + err);
//   } else
//     console.log('save success\n' + log);
// });
// /* end */
/* end */

module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;
