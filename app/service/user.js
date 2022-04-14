const Service = require('egg').Service
const jwt = require('jsonwebtoken');

class UserService extends Service {
    get User() {
        return this.app.model.User
    }
    findByUserName(userName) {
        return this.User.findOne({
            userName
        })
    }

    findByEmail(email) {
        return this.User.findOne({
            email
        }).select('+password')
    }

    async createUser(data) {
        data.password = this.ctx.helper.md5(data.password)
        const user = new this.User(data)
        await user.save()
        return user
    }

    createToken(data) {
        return jwt.sign(data, this.app.config.jwt.secret, {
            expiresIn: this.app.config.jwt.expiresIn
        })
    }

    verifyToken(token) {
        return jwt.verify(token, this.app.config.jwt.secret)
    }

    // 更新用户信息
    updateUser(data) {
        return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
            new: true,
            useFindAndModify: false
        })
    }

    // 订阅
    async subscribe(userId, channelId) {
        const { Subscription, User } = this.app.model
        // 检查是否已经订阅
        const record = await Subscription.findOne({
            user: userId,
            channel: channelId
        })
        const user = await User.findById(channelId)
        if (!record) {
            await new Subscription({
                user: userId,
                channel: channelId
            }).save()
            user.subscribersCount++
            await user.save()
        }
        return user
    }

    // 取消订阅
    async unsubscribe(userId, channelId) {
        const { Subscription, User } = this.app.model
        // 检查是否已经订阅
        const record = await Subscription.findOne({
            user: userId,
            channel: channelId
        })
        const user = await User.findById(channelId)
        if (record) {
            await record.remove() // 删除订阅记录
            user.subscribersCount--
            await user.save()
        }
        return user
    }

}

module.exports = UserService;