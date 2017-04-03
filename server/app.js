/**
 * Created by huangpeisong on 2017/3/23.
 */

const Koa = require('koa');
const app = new Koa();
const csrf = require('koa-csrf');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const convert = require('koa-convert');
const cors = require("koa-cors");

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
const routers = require('./router/allRouter');


app
  .use(routers.routes())
  .use(routers.allowedMethods());

app.listen(3000);


