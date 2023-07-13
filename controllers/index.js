// https://juejin.cn/post/6844903685164646413?searchId=202307122110094EFF43F01097251190CD#heading-6
import KoaRouter from 'koa-router'
import { MongoClient, ObjectId } from 'mongodb'

const client = await MongoClient.connect('mongodb://localhost:27017');
const db = client.db("book");

const router = new KoaRouter({
  prefix: '/api'
})

const users = {
  "admin": "admin"
}

router.get('/', async (ctx, next) => {
  // todo
  const res = 'Hello'
  ctx.response.body = res
  return res
})

// /mongon
router.post('/mongo', async (ctx, next) => {
  let res = {}
  const reqBody = ctx.request.body
  console.log(reqBody)
  // 参数名非空校验
  if (!reqBody.collection || !reqBody.method) {
    // 没有传用户名或者密码
    res = {
      code: 1,
      msg: 'params error'
    }
    ctx.response.body = res
    return res
  }
  const coll = db.collection(reqBody['collection'])
  // 查询
  if (reqBody['method'].includes('find')) {
    reqBody['method'] = 'find'
    const datas = await coll[reqBody['method']](reqBody['args']).toArray()
    console.log('datas', datas)
    res = {
      code: 0,
      data: datas,
      msg: 'params error'
    }
  } else {
    // 其他操作
    if (Array.isArray(reqBody.args)) {
      // 修改或者
      console.log("convert id arr")
      if (reqBody.args[0]._id) {
        reqBody.args[0]._id = new ObjectId(reqBody.args[0]._id)
      }
    } else {
      reqBody.args._id = new ObjectId(reqBody.args._id)
    }
    const resp = await coll[reqBody['method']](...reqBody.args)
    res = {
      code: 0,
      data: resp,
      msg: `${reqBody['method']} success`
    }

  }
  ctx.response.body = res
  return res
})
// 登录接口
router.post('/login', async (ctx, next) => {
  let res = 'login'
  const reqBody = ctx.request.body
  console.log(reqBody)
  // 参数名非空校验
  if (!reqBody.username || !reqBody.password) {
    // 没有传用户名或者密码
    res = {
      code: 1,
      msg: 'username and password is requied'
    }
    ctx.response.body = res
    return res
  }
  if (reqBody.username && users[reqBody.username]) {
    const users = await db.collection('loginUsers').find({ username: reqBody.username }).toArray()
    console.log('users', users)
    if (users.length === 0) {
      // 用户名不存在, 提示用户名或密码不正确
      res = {
        code: 2,
        msg: 'username or password is wrong'
      }
    } else if (users.length === 1) {
      if (users[0].password === reqBody.password) {
        // 登录成功
        res = {
          code: 0,
          msg: 'login success'
        }
      } else {
        // 用户名或密码不正确
        res = {
          code: 2,
          msg: 'username or password is wrong'
        }
      }
    }
  } else {
    res = {
      code: -1,
      msg: 'failed'
    }
  }
  ctx.response.body = res
  return res
})
// 注册接口
router.post('/register', async (ctx, next) => {
  let res = {}
  const reqBody = ctx.request.body
  console.log(reqBody)
  // 参数名非空校验
  if (!reqBody.username || !reqBody.password) {
    // 没有传用户名或者密码
    res = {
      code: 1,
      msg: 'username and password is requied'
    }
    ctx.response.body = res
    return res
  }
  const userLogin = db.collection('loginUsers')
  // 用户存在判断
  const users = await userLogin.find({ username: reqBody.username }).toArray()
  if (users.length > 0) {
    // 用户名已存在
    res = {
      code: 2,
      msg: 'username is exist'
    }
  } else {
    // 写入到登录用户表
    userLogin.insertOne({
      username: reqBody.username,
      password: reqBody.password
    })
    res = {
      code: 0,
      msg: 'registered success'
    }
  }
  ctx.response.body = res
  return res
})

export default router