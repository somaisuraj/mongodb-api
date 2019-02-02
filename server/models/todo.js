const mongoose = require('mongoose');

// not models it is model(singular)
// Todo is constructor function so capital T
var Todo = mongoose.model('todo', {
  text: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {//can be any name
    type: mongoose.Schema.Types.ObjectId,// creator property
    required: true
  }
});

module.exports = {Todo};// es6 feature todo: todo
