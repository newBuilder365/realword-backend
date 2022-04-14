'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  // 注册用户
  async create() {
    const body = this.ctx.request.body
    this.ctx.validate({
      username: { type: "string" },
      email: { type: 'email' },
      password: { type: 'string' }
    }, body)

    const userService = this.service.user;
    if (await userService.findByUserName(body.username)) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'username',
            message: '用户已存在'
          }
        ]
      })
    }

    if (await userService.findByEmail(body.email)) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'email',
            message: '邮箱已存在'
          }
        ]
      })
    }

    const user = await userService.createUser(body)
    const token = userService.createToken({
      userId: user._id
    })
    this.ctx.body = {
      user: {
        userId: user._id,
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image
      }
    }
  }

  // 登陆
  async login() {
    const body = this.ctx.request.body
    this.ctx.validate({
      email: { type: 'email' },
      password: { type: 'string' }
    }, body)
    const userService = this.service.user;
    const user = await userService.findByEmail(body.email)
    if (!user) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'email',
            message: '用户不存在'
          }
        ]
      })
    }
    if (this.ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'password',
            message: '密码不正确'
          }
        ]
      })
    }
    const token = userService.createToken({ userId: user._id })
    this.ctx.body = {
      user: {
        userId: user._id,
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image
      }
    }
  }

  // 获取当前用户信息
  async getCurrentUser() {
    const body = this.ctx.request.body
    const user = this.ctx.user
    this.ctx.body = {
      user: {
        email: user.email,
        token: user.token,
        username: user.username,
        image: user.image,
        bio: user.bio
      }
    }
  }

  // 更新当前用户信息
  async update() {
    const body = this.ctx.request.body
    // 1. 数据校验
    this.ctx.validate({
      email: { type: 'email', required: false },
      password: { type: 'string', required: false },
      username: { type: "string", required: false },
      bio: { type: "string", required: false },
      image: { type: "string", required: false }
    }, body)

    const userService = this.service.user
    // 2. 检查用户是否存在
    if (body.username) {
      if (body.username !== this.ctx.user.username && await userService.findByUserName(body.username)) {
        this.ctx.throw(422, '用户名已存在')
      }
    }
    // 3. 检查邮箱是否存在
    if (body.email) {
      if (body.email !== this.ctx.user.email && await userService.findByEmail(body.email)) {
        this.ctx.throw(422, '邮箱已存在')
      }
    }
    // 4. 更新用户信息
    if (body.password) {
      body.password = this.ctx.helper.md5(body.password)
    }

    const user = await userService.updateUser(body)
    // 5. 返回更新之后的用户信息
    this.ctx.body = {
      user: {
        email: user.email,
        token: user.token,
        username: user.username,
        bio: user.bio,
        image: user.image
      }
    }
  }

  // 获取用户信息
  async getUser() {
    let isSubscribed = false
    if (this.ctx.user) {
      let record = await this.app.model.Subscription.findOne({
        user: this.ctx.user._id,
        channel: this.ctx.params.userId
      })
      if (record) {
        isSubscribed = true
      }
    }
    let user = await this.app.model.User.findById(this.ctx.params.userId)
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ]),
        isSubscribed
      }
    }
  }

  async getUserInfoByName() {
    const username = this.ctx.params.username
    const { User } = this.app.model
    const user =await User.findOne({username})
    this.ctx.body = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: user.following
    }
  }

  //订阅
  async subscribe() {
    const userId = this.ctx.user._id
    const channelId = this.ctx.params.userId
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能订阅自己')
    }

    // 添加订阅
    const user = await this.service.user.subscribe(userId, channelId)
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ]),
        isSubscribed: true
      }
    }
  }

  // 取消订阅
  async unsubscribe() {
    const userId = this.ctx.user._id
    const channelId = this.ctx.params.userId
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能订阅自己')
    }

    // 取消订阅
    const user = await this.service.user.unsubscribe(userId, channelId)
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ]),
        isSubscribed: false
      }
    }
  }

  // 获取用户订阅数据
  async getSubscriptions() {
    let userId = this.ctx.params.userId
    const Subscription = this.app.model.Subscription
    let SubscriptionDatas = await Subscription.find({
      user: userId
    }).populate('channel')
    SubscriptionDatas = SubscriptionDatas.map(item => {
      return {
        _id: item.channel._id,
        username: item.channel.username,
        avatar: item.channel.avatar
      }
    })
    this.ctx.body = {
      SubscriptionDatas
    }
  }
}

module.exports = UserController;
