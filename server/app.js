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
// test.save(function (err, log) {
//   if (err) {
//     console.log('save error:' + err);
//   } else
//     console.log('save success\n' + log);
// });
// /* end */


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
    await user.save(function (err, doc) {
      if (err != null) {
        resBody.type = "error";
        resBody.message = 'check out your input,do you feel my angry :(';
        // return ctx.redirect('/404')
      }
      else {
        session.current_user = {
          username: body.username,
          password: body.password
        };
        resBody.type = 'success';
        resBody.message = 'register success, your are bang bang';
        // return ctx.redirect('/')
      }
    })
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
})
;
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
  var body =[];
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
      body={
        type:'error',
        info:"check out your login status"
      };
    }
  }
  JSON.stringify(body);
  ctx.body = body;
});
router.get('/user/api/outcome/:username', async (ctx) => {
  var username = ctx.params.username;
  //验证session
  if (ctx.session.current_user.username == username) {
    let body = [];
    await UserModel.findByUsername(username, function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        for (var i = 0; i < doc.accounts.length; i++) {
          if (doc.accounts[i].status == 3 || doc.accounts[i].status == 4)
            body.push(doc.accounts[i]);
        }
        console.log(body)
      }
    })
    JSON.stringify(body);
    ctx.body = body;
  }

});
router.get('/user/api/allcome/:username', async (ctx) => {
  var username = ctx.params.username;
  console.log()
  //验证session
  if (ctx.session.current_user.username == username) {
    let body = [];
    await UserModel.findByUsername(username, function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        for (var i = 0; i < doc.accounts.length; i++) {
          if (doc.accounts[i].status == 3 || doc.accounts[i].status == 4 || doc.accounts[i].status == 1 || doc.accounts[i].status == 2)
            body.push(doc.accounts[i]);
        }
        console.log(body)
      }
    })
    JSON.stringify(body);
    ctx.body = body;
  }

});
//此处是迷乱中写的session 验证 未验证 不可信
router.post('/user/api/del/:username', async (ctx) => {
  var username = ctx.params.username;
  var id = ctx.request.body.id;
  if (ctx.session.current_user.username == username) {
    UserModel.update({'username': username}, {$pull: {"accounts": {"_id": id}}}, function (err, doc) {
      if (err) {
        console.log(err);
      }
      console.log(doc);
    })
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);


