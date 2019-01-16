const {mongoose} = require('./../server/db/mongoose');//(./ is relative path (..)is back )

const {User} = require('./../server/models/users');
const id = "5c3f36efca2b1a31dcdc049b";

//finding all users with same id and result is in array
User.find({_id: id}).then((users) => {
  console.log('users', users);
}, (err) => {
  console.log('error', err);
});

//finding the first one with many id return in object
User.findOne({_id:id}).then((users) => {
  console.log('users', users);
}, (err) => {
  console.log('errors', err);
});

// this is specific find and return data in object
User.findById(id).then((user) => {
  if (!user) {
    return console.log('user not found');
 }
  console.log('user', user);
}).catch((err) => {//catch is used if previous promises get any error, id ivalid run if statement but when id is invalie then error -
  console.log('id not found',err);//occurs which only catch could catch
});
