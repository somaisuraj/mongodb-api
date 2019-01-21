const mongoose = require('mongoose');

var User = mongoose.model('user', {
  user: {
    type: String,
    required: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {User};
