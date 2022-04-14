module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const profileSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    following: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  return mongoose.model('Profile', profileSchema)
}