const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 }
})
//kun kutsutaan toJSON(), suoritetaan nämä muutokset!
blogSchema.set('toJSON', {
  //muuttaa kentän _id => id
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)