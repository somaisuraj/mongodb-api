const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema( {
  user: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{value} is not a alid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {type: String, required: true},
    token: {type: String, required: true }
          }]


});
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject =user.toObject();// this takes mongoose variable to regular object
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';                               //func access var
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();


  user.tokens.push({access, token});//= user.tokens.concat([{access, token}]);

return user.save().then(() => { //this is done to get user and token variable
  return token;
});
};



var User = mongoose.model('user', UserSchema);

module.exports = {User};
