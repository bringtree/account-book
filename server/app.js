/**
 * Created by huangpeisong on 2017/3/23.
 */
const UserModel = require('./models/user').UserModel;
const UserSchema = require('./models/user').UserSchema;
const Koa = require('koa');
const app = new Koa();
const csrf = require('koa-csrf');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const router = require('koa-router')();
const convert = require('koa-convert');
const cors = require("koa-cors");
// var Promise = require("bluebird");

app.use(bodyParser());
app.use(cors());

//session
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: new MongoStore({
    url: "mongodb://127.0.0.1:27017/db_cost",
    ttl: 60000,
  })
}));
// app.use(new csrf());


/* test data001*/
var test = new UserModel({
    name: "xiaoming",
    username: "xiao",
    password: "ming",
    accounts: [{
      status: 1,
      date: "2017-03-23T02:30:24.837Z",
      thing: "play",
      money: 10
    }, {
      status: 1,
      date: "2017-03-24T02:30:24.837Z",
      thing: "sleep",
      money: 20
    }, {
      status: 1,
      date: "2017-03-25T02:30:24.837Z",
      thing: "play",
      money: 10
    },
      {
        status: 2,
        date: "2017-03-23T02:30:24.837Z",
        thing: "play",
        money: 10
      }, {
        status: 2,
        date: "2017-03-24T02:30:24.837Z",
        thing: "sleep",
        money: 20
      }, {
        status: 2,
        date: "2017-03-25T02:30:24.837Z",
        thing: "play",
        money: 10
      },
      {
        status: 3,
        date: "2017-03-23T02:30:24.837Z",
        thing: "play",
        money: 10
      }, {
        status: 3,
        date: "2017-03-24T02:30:24.837Z",
        thing: "sleep",
        money: 20
      }, {
        status: 4,
        date: "2017-03-25T02:30:24.837Z",
        thing: "play",
        money: 10
      }]
  }
);
//
// test.save(function (err, log) {
//   if (err) {
//     console.log('save error:' + err);
//   } else
//     console.log('save success\n' + log);
// });
// /* end */
/* end */

router.post('/register', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  let session = ctx.session;
  let body = ctx.request.body;
  let user = new UserModel({
    username: body.username,
    password: body.password,
    name: body.user
  });
  let resBody = {
    type: "",
    message: ""
  };
  if (user.username && user.password && user.name) {
    try {
      var result = await user.save();
      if (result) {
        session.current_user = {
          username: body.username,
          password: body.password
        };
        resBody.type = 'success';
        resBody.message = 'register success, your are bang bang';
      }
    }
    catch (err) {
      resBody.type = "error";
      resBody.message = 'check out your input,do you feel my angry :(';
    }
  } else {
    resBody.type = "error";
    resBody.message = 'check out your input,do you feel my angry :(';
  }
  ctx.body = resBody
});
router.post('/login', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  let session = ctx.session;

  let body = ctx.request.body;
  let user = {
    username: body.username,
    password: body.password
  };
  let resBody = {
    type: "",
    message: ""
  };
  var result1 = await UserModel.findByUsername(user.username)
  if (result1 == null) {
    resBody.type = 'error';
    resBody.message = "i can't find your username ,did you register?";
  }
  if (result1 != null) {
    if (user.password === result1.password) {
      resBody.type = "success";
      resBody.message = "login success"
      // return ctx.redirect()
      session.current_user = {
        username: body.username,
        password: body.password
      };
    }
    else {
      resBody.type = "error";
      resBody.message = "check out your passwords";
    }
  }
  ctx.body = resBody;
});


router.post('/user/api/checkusername', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  let body = ctx.request.body;
  let user = {
    username: body.username,
  };
  let resBody = {
    message: ""
  };
  var result1 = await UserModel.findByUsername(user.username);
  if (result1) {
    resBody.message = 'repeat'
  }
  else {
    resBody.message = 'access'
  }

  ctx.body = resBody;
});
router.post('/user/api/add', async (ctx, next) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  var username = ctx.session.current_user.username;
  var oldAccount = "";
  var account = {
    thing: ctx.request.body.thing,
    date: ctx.request.body.date,
    status: ctx.request.body.status,
    money: ctx.request.body.money
  };

  var resBody = {};
  var result1 = await UserModel.findByUsername(username);
  if (result1) {
    oldAccount = result1.accounts;
    oldAccount.push(account);
  } else {
    console.log(err);
    resBody = {
      type: "fail",
      message: "please check out your login status or input"
    }
  }

  var result2 = await UserModel.addAccount(username, oldAccount);
  if (result2) {
    resBody = {
      type: "success",
      message: "input success"
    };

  }
  else {
    resBody = {
      type: "fail",
      message: "please check out your login status or input"
    }
  }
  console.log(oldAccount)
  console.log(result2)
  ctx.body = resBody

});
router.get('/user/api/income/:username', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  var body = [];
  var username = ctx.params.username;
  if (ctx.session.current_user.username == username) {
    var result1 = await UserModel.findByUsername(username)
    if (result1) {
      for (var i = 0; i < result1.accounts.length; i++) {
        if (result1.accounts[i].status == 1 || result1.accounts[i].status == 2)
          body.push(result1.accounts[i]);
        console.log(result1.accounts[i])
      }
    }
    else {
      body = {
        type: 'error',
        info: "check out your login status"
      };
    }
  }
  JSON.stringify(body);
  ctx.body = body;
});
router.get('/user/api/outcome/:username', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  var body = [];
  var username = ctx.params.username;
  if (ctx.session.current_user.username == username) {
    var result1 = await UserModel.findByUsername(username)
    if (result1) {
      for (var i = 0; i < result1.accounts.length; i++) {
        if (result1.accounts[i].status == 3 || result1.accounts[i].status == 4)
          body.push(result1.accounts[i]);
        console.log(result1.accounts[i])
      }
    }
    else {
      body = {
        type: 'error',
        info: "check out your login status"
      };
    }
  }
  JSON.stringify(body);
  ctx.body = body;
});
router.get('/user/api/allcome/', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  var body = [];
  var username = ctx.session.current_user.username;
  var result1 = await UserModel.findByUsername(username);
  if (result1) {
    for (var i = 0; i < result1.accounts.length; i++) {
      body.push(result1.accounts[i]);
      console.log(result1.accounts[i])
    }

  }
  else {
    body = {
      type: 'error',
      info: "check out your login status"
    };
  }
  JSON.stringify(body);
  ctx.body = body;

});
router.get('/user/api/state', async (ctx) => {

  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  try {
    var name = ctx.session.current_user.username;
    ctx.body = {
      "type": "success",
      "info": "access"
    }
  }
  catch (e) {
    ctx.body = {
      "type": "false",
      "info": "noPass"
    }
  }

});
router.get('/user/api/clear', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  ctx.session = null;
  ctx.body = {
    "type": "success",
    "message": "clear cookie success"
  }
});
router.post('/user/api/edi/', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  var username = ctx.session.current_user.username;
  var id = ctx.request.body._id
  var result1, result2;
  try {
    result1 = await UserModel.update({'username': username}, {$pull: {"accounts": {"_id": id}}}).exec();
    result2 = await UserModel.update({'username': username}, {$push: {"accounts": ctx.request.body}}).exec();
  } catch (err) {
    console.log(err);
  }
  if (result1.nModified == 1 && result2.nModified == 1) {
    ctx.body = {
      type: 'success',
      message: 'edit success'
    }
  }
  else {
    ctx.body = {
      type: 'error',
      message: 'edit fail'
    }
  }


});
router.post('/user/api/del/', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };
  var username = ctx.session.current_user.username;
  var id = ctx.request.body.id;
  var body = {};
  var doc;
  try {
    doc = await UserModel.update({'username': username}, {$pull: {"accounts": {"_id": id}}}).exec();
  }
  catch (err) {
    console.log("del have a big error");
  }
  if (doc.nModified == 0) {
    body.type = 'error';
    body.message = 'delete error'
  }
  else {
    body.type = 'success';
    body.message = 'delete success';
  }
  ctx.body = body;

});
router.get('/user/api/hxji', async (ctx) => {

  // var a = await UserModel.find({'accounts.status':'1'}).exec();

  // UserModel.aggregate().unwind('accounts').match({'accounts.status':'1'}).sort({'accounts.money':1}).skip(0).limit(10).group({_id:"$_id",accounts:{$push:"$accounts"}}).exec()
  // var b =await UserModel.aggregate().unwind('accounts').exec()   //这条是正常
  // var b = await UserModel.aggregate().unwind('accounts').match({'accounts.status':'1'}).exec(); //这条匹配到是空的

  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };

  var b = await UserModel.aggregate().unwind('accounts').sort({'accounts.money': 1}).group({
    _id: "$_id",
    status: {$push: "$accounts"},
    name: {$push: "$name"},
    username: {$push: '$username'}
  }).exec()

  // sort({'accounts.money':1}).skip(0).limit(10).group({_id:"$_id",accounts:{$push:"$accounts"}}).
  var data = [];
  for (var i = 0; i < b.length; i++) {
    for (var j = 0; j < b[i].status.length; j++) {
      if (b[i].status[j].status == 4) {
        b[i].status[j].name = b[i].name[j];
        b[i].status[j].username = b[i].username[j];
        data.push(b[i].status[j]);
      }
    }
  }
  ctx.body = data;
});


router.post('/boss/access', async (ctx) => {

  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    'Access-Control-Allow-Methods': 'POST,GET'
  };

  var username = ctx.session.current_user.username;
  var power = await UserModel.findByUsername(username);
  power = power.admin;

  var data = ctx.request.body;

  var form = {
    'date': data.date,
    'status': '3',
    'thing': data.thing,
    'money': data.money,
    '_id': data._id
  }
  var result1, result2;
  if (power == true) {
    try {
      result1 = await UserModel.update({'username': data.username}, {$pull: {"accounts": {"_id": data._id}}}).exec();
      result2 = await UserModel.update({'username': data.username}, {$push: {"accounts": form}}).exec();
    } catch (err) {
      console.log(err);
    }
    if (result1.nModified == 1 && result2.nModified == 1) {
      ctx.body = {
        type: 'success',
        message: 'edit success'
      }
    }
    else {
      ctx.body = {
        type: 'error',
        message: 'try again?'
      }
    }


  } else {
    ctx.body = {
      type: 'error',
      message: 'sorry,my dear admin'
    }
  }
});
router.post('/boss/reject', async (ctx) => {

  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    'Access-Control-Allow-Methods': 'POST,GET'
  };

  var username = ctx.session.current_user.username;
  var power = await UserModel.findByUsername(username);
  power = power.admin;
  var doc;
  var body = ctx.request.body;
  if (power == true) {

    try {
      doc = await UserModel.update({'username': body.username}, {$pull: {"accounts": {"_id": body._id}}}).exec();
    }
    catch (err) {
      ctx.body = {
        type: 'error',
        message: 'sorry,my dear admin'
      };
      console.log("del have a big error");
    }

    if (doc.nModified == 0) {
      ctx.body = {
        type: 'error',
        message: 'delete error'
      }
    }
    else {
      ctx.body = {
        type: 'success',
        message: 'delete success'
      }
    }

  } else {
    ctx.body = {
      type: 'error',
      message: 'sorry,my dear admin'
    }
  }

});
router.get('/boss/check', async (ctx) => {
  ctx.response.header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    'Access-Control-Allow-Methods': 'POST,GET'
  };
  var username = ctx.session.current_user.username;
  try {
    var power = await UserModel.findByUsername(username);
    power = power.admin;
  }
  catch (err){}
  if (power == true) {
    ctx.body ={
      type: "true"
    };
  }
  else {
    ctx.body = {
      type: "false"
    };;
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);


