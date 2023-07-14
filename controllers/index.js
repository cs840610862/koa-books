// https://juejin.cn/post/6844903685164646413?searchId=202307122110094EFF43F01097251190CD#heading-6
import KoaRouter from 'koa-router'
import { MongoClient, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const client = await MongoClient.connect('mongodb://localhost:27017');
const db = client.db("book");

const router = new KoaRouter({
  prefix: '/api'
})

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
  console.log('1111', reqBody)
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
  if (reqBody.username) {
    const users = await db.collection('users').find({ username: reqBody.username }).toArray()
    console.log('users', users)
    if (users.length === 0) {
      // 用户名不存在, 提示用户名或密码不正确
      res = {
        code: 2,
        msg: 'username or password is wrong'
      }
    } else if (users.length === 1) {
      // 验证密码
      // 哈希加密密码
      if (await bcrypt.compare(reqBody.password, users[0].password)) {
        // 登录成功
        let payload = { username: reqBody.username, time: new Date().getTime(), timeout: 1000 * 60 * 60 * 2 }
        let token = jwt.sign(payload, "screct")
        res = {
          code: 0,
          token: token,
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
  const userLogin = db.collection('users')
  // 用户是否存在判断
  const users = await userLogin.find({ username: reqBody.username }).toArray()
  if (users.length > 0) {
    // 用户名已存在
    res = {
      code: 2,
      msg: 'username is exist'
    }
  } else {
    // 哈希加密密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(reqBody.password, salt);
    // 写入到登录用户表
    userLogin.insertOne({
      username: reqBody.username,
      password: passwordHash,
      phone: '',
      addr: ''
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