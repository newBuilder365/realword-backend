// app/config/user.js
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const userSchema = new Schema({
    username: { // 用户名
      type: String,
      required: true
    },
    email: { // 邮箱
      type: String,
      required: true
    },
    password: { // 密码
      type: String,
      select: false, // 查询中不包含该字段
      required: true
    },
    image: { // 头像
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: ""
    },
    following: {
      type: Boolean,
      default: false
    },
    createdAt: { // 创建时间
      type: Date,
      default: Date.now
    },
    updatedAt: { // 更新时间
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('User', userSchema)
}
