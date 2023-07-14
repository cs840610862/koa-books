// https://juejin.cn/post/6844903685164646413?searchId=202307122110094EFF43F01097251190CD#heading-6
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './controllers/index.js'
import checkTokens from './middleware/checkTokens.js'
// import KoaRouter from 'koa-router'

const app = new Koa();

app.use(bodyParser());  // 解析request的body
app.use(checkTokens);
app.use(router.routes())

app.listen(9000);
console.log('app started at port 9000...')
