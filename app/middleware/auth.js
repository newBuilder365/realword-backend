module.exports = (options = { isRequired: true }) => {
    return async (ctx, next) => {
        // 1. 获取请求头中的token
        let token = ctx.headers['authorization']
        token = token ? token.split('Bearer ')[1] : null
        // 3. token有效，根据userId获取用户数据挂载到 ctx对象上使用
        if (token) {
            try {
                const user = ctx.service.user.verifyToken(token)
                ctx.user = await ctx.model.User.findById(user.userId)
                ctx.user.token = token
            } catch (error) {
                ctx.throw(401)
            }
        } else if (options.isRequired) {
            ctx.throw(401)
        }
        // 4. next执行后续中间件
        await next()
    }
}