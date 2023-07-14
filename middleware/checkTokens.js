import jwt from 'jsonwebtoken'

async function check(ctx, next) {
    // split('?')[0]把字符串分割成字符串数组——拿到url值
    let url = ctx.url.split('?')[0]
    // 如果是登陆页面和注册页面就不需要验证token了
    const whites = ['/api/login', '/api/register']
    if (whites.includes(url)) {
        await next()
    } else {
        //获取到token
        let token = ctx.request.headers["token"]
        token = token === 'undefined' ? '' : token
        console.log('token', token)
        if (!token) {
            ctx.body = {
                code: -1,
                msg: '请带上token'
            }
            return
        }
        if (token) {
            //  如果有token的话解析
            const tokenItem = jwt.verify(token, 'screct')
            console.log('tokenItem', tokenItem)
            //    把创建时间和过期时间析构出来
            const { time, timeout } = tokenItem
            // 拿到当前时间
            let NewTime = new Date(time).getTime()
            if (NewTime - time <= timeout) {
                // 说明没过期
                await next()
                return
            }
        }
        ctx.body = {
            code: -1,
            msg: '请带上 token'
        }
    }
}
export default check