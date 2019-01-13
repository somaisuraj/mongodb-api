const mongoose = require('mongoose');

var User = mongoose.model('surya', {
  user: {
    type: String,
    required: true,
    minLength: 1
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true

  }
});

module.exports = {User};
