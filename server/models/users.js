const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema( {
  user: {
    type: String,
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
  var userObject =user.toObject();// this takes and makes mongoose variable to regular object
  return _.pick(userObject, ['_id','user', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';                               //func access var
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();


  user.tokens.push({access, token});//= user.tokens.concat([{access, token}]);

return user.save().then(() => { //this is done to get user and token variable
  return token;
});
};

UserSchema.methods.removeToken = function(token) {
   let user = this;
   return user.update({
     $pull: { //$pull is from moongoose library for pulling or deleting
       tokens: {token}//es6 token: token
     }
   });
};

UserSchema.statics.findByToken = function (token) {
  let User = this;//this is model function so this means model
  let decoded;

  try {
   decoded = jwt.verify(token, process.env.JWT_SECRET); //it return an object.
 } catch(e) {
   return //new Promise((resolve, reject) => {
      Promise.reject()  //   reject();  smaller version of reject promise
   // });
  }
  return User.findOne({// this findOne returns a promise so this function is returning-
    _id:decoded._id,   //- returning whole User.findOne to chain in server.js line 49.
    'tokens.token':token,//we are using quotes because there is dot or nested object
    'tokens.access':'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
     if (!user) {
       return Promise.reject();// this need more clarification
     }
     return new Promise((resolve, reject) => {
       bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            }else {
              reject();
            }
       });
     });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {//here you write any numbers high number means more secure
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        })
      });
  } else {
    next();
  }
});

var User = mongoose.model('user', UserSchema); // mongoose.model takes('name for the collection', {object which is UserSchema});

module.exports = {User};
