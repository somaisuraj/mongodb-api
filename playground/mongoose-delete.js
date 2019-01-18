const {mongoose} = require('./../server/db/mongoose');//(./ is relative path (..)is back )

const {User} = require('./../server/models/users');
const {ObjectID} = require('mongodb');

User.findOneAndDelete({user: "hunter"}).then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(err);
});
User.findByIdAndDelete({_id: ObjectID('5c41c0a922c93a20c371458d')}).then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(err);
});
