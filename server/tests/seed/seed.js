const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');


let userOneId = new ObjectID();
let userTwoId = new ObjectID();//created to use for sign token
const users = [{
  _id: userOneId,
  user: 'hunter',
  email:'hunter@gmail.com',
  password: 'abc123',
  tokens: [{
    access:'auth',
    token: jwt.sign({_id: userOneId, access:'auth'}, 'abc123').toString()
}]
}, {
  _id: userTwoId,
  user :'surya',
  email: 'surya@yahoo.com',
  password:'abc1234',
  tokens: [{
    access:'auth',
    token: jwt.sign({_id: userTwoId, access:'auth'}, 'abc123').toString()
}]

  }];

const todos = [{
  _id: new ObjectID(),
  text: 'first todo',
  _creator: userOneId //assiginig the user id

}, {
  _id: new ObjectID(),
  text: 'second todo',
  completed: true,
  completedAt: 123,
  _creator: userTwoId
}];//this is seed data because beforeEach will run before other function
//and will delete all data.
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);//with retrun we can't call other then();
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};
module.exports = {todos, populateTodos, users, populateUsers};
