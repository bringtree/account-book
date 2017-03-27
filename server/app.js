/**
 * Created by huangpeisong on 2017/3/23.
 */
const UserModel = require('./models/user').UserModel;
const UserSchema = require('./models/user').UserSchema;
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const router = require('koa-router')();
const convert = require('koa-convert');


app.use(bodyParser());

//session
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: new MongoStore({
    url: "mongodb://127.0.0.1:27017/db_cost",
    ttl: 60000,
  })
}));


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
test.save(function (err, log) {
  if (err) {
    console.log('save error:' + err);
  } else
    console.log('save success\n' + log);
});
/* end */


router.post('/register', async (ctx) => {

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
      if (err!=null) {
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
  let body = ctx.request.body;
  let user = {
    username: body.username,
    password: body.password
  };
  let resBody = {
    type:"",
    message:""
  };
  await UserModel.findByUsername(user.username, (err, doc) => {
    if (doc==null) {
      resBody.type = 'error';
      resBody.message = "i can't find your username ,did you register?";
    }
    if(doc!=null) {
      if (user.password === doc.password) {
          resBody.type = "success";
          resBody.message = "login success"
          // return ctx.redirect()
      }
      else {
        resBody.type = "error";
        resBody.message = "check out your passwords";
      }
    }
    console.log(doc)
    console.log(err)
  });
  console.log(resBody)
  ctx.body= resBody;
});
router.post('/user/api/checkusername', async (ctx) => {
  let body = ctx.request.body;
  let user = {
    username: body.username,
  };
  let resBody = {
    message: ""
  };
  await UserModel.findByUsername(user.username, (err, doc) => {
    if (err!=null) {
      console.log(err);
    }
    else {
      if (doc == null) {
        resBody.message = 'access'
      }
      else {
        resBody.message = 'repeat'
      }
    }
  });
  ctx.body = resBody;
});
router.post('/user/api/add/:username', async (ctx) => {
  var username = ctx.params.username;
  var oldAccount = "";
  var account = {
    thing: ctx.request.body.thing,
    date: ctx.request.body.date,
    status: ctx.request.body.status,
    money: ctx.request.body.money
  };
  await UserModel.findByUsername(username, function (err, doc) {
    if (err) {
      console.log(err);
    }
    oldAccount = doc.accounts;
    oldAccount.push(account);
  });

  UserModel.addAccount(username, oldAccount, function (err, doc) {
    if (err) {
      console.log(err);
    }
    console.log(doc)
  })


});
router.get('/user/api/income/:username', async (ctx) => {

  var username = ctx.params.username;
  //验证session
  if (1) {
    let body = [];
    await UserModel.findByUsername(username, function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        for (var i = 0; i < doc.accounts.length; i++) {
          if (doc.accounts[i].status == 1 || doc.accounts[i].status == 2)
            body.push(doc.accounts[i]);
        }
        console.log(body)
      }
    })
    JSON.stringify(body);
    ctx.body = body;
  }

});
router.get('/user/api/outcome/:username', async (ctx) => {
  var username = ctx.params.username;
  //验证session
  if (1) {
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
  //验证session
  if (1) {
    let body = [];
    await UserModel.findByUsername(username, function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        for (var i = 0; i < doc.accounts.length; i++) {
          if (doc.accounts[i].status == 3 || doc.accounts[i].status == 4||doc.accounts[i].status == 1||doc.accounts[i].status == 2)
            body.push(doc.accounts[i]);
        }
        console.log(body)
      }
    })
    JSON.stringify(body);
    ctx.body = body;
  }

});
router.post('/user/api/del/:username', async (ctx) => {
  var username = ctx.params.username;
  var id = ctx.request.body.id;
  UserModel.update({'username': username}, {$pull: {"accounts": {"_id": id}}}, function (err, doc) {
    if (err) {
      console.log(err);
    }
    console.log(doc);
  })
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);


