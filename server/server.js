var express = require('express');
var bodyParser = require('body-parser');

// this is object deststructuring variable like require(mongoose.js) = {mongoose: 'somedata'}--
// so taking that mongoose and declaring as variable mongoose = (source of the data i.e moongoose.js)--
// which is automatically 'somedata'
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');

const app = express();
app.use(bodyParser.json());

// new  is creating the model intance of Todo varaiable which is model in source file
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

// we are using promise chaining method
  todo.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/users',(req, res) => {
  var user = new User({
    user: req.body.name,
    email: req.body.email
  });

  user.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('server running at 3000')
});

module.exports = {app};
