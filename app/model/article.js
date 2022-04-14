module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const articleSchema = new Schema({
    slug: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    tagList: {
      type: [String],
      required: true
    },
    createdAt: { // 创建时间
      type: Date,
      default: Date.now
    },
    updatedAt: { // 更新时间
      type: Date,
      default: Date.now
    },
    favorited: {
      type: Boolean,
      required: false
    },
    favoritesCount: {
      type: Number,
      required: true,
      default: 0
    },
    author: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User'
    }
  })

  return mongoose.model('Article', articleSchema)
}