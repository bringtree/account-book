# finance
v1.0
http://118.89.33.168/index.html#/menu/accountline
管理员号
用户名 admin 密码admin

使用手册

只有管理员才可以 清账

修改信息的话 点击 文字就行了  ，删除的话那里有个按钮

清账后的数据是不能被修改 和 删除的

就这样了
mongodb数据库 mongod mongo

启动 server目录下 npm install   
                node app
主目录  npm install
npm run dev


一个 记账本 

1前端Vue2 框架  

	组件主要用了 element 
	
	图表用了echarts的饼图
	
	用了md5在前端进行加密
	
	ajax用axios 
	
	账单信息利用vuex存储在 store中，这是一个单页面应用，所以就不要刷新搞事情了
	

2后端用nodejs(koa2框架)

	登陆验证用的是cookie-session(这里有点小问题 是中间件的问题 那个中间件有时候会出现3个 4个 甚至更多的cookie 再用户注册的时候 所以。。。遇到什么异常 客户端 清除下cookie就好了)
	
	每次数据库操作都会进行一次验证 （为了检验权限）
	
	数据库操作用的是mongoose模块,深坑  没有中文文档 。连官方文档都有些问题 要去查mongodb的文档 然后来推出用法，官方文档有括号不匹配 等等 问题。。。。
	
	这次在用聚合操作就深陷该坑
	
	koa2框架虽然B格高 但是用的人少 出错极其麻烦
	
	当用户点击退出时清除session，如果用户没有点击 下次可以免密码登陆
	
	用上了async await 等等B格高的操作 应对异步操作
	
3数据库mongodb

	session存储在其中
	
	用户的信息也是

4服务器

	nginx反向代理 
