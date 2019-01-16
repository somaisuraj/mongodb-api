var express = require('express');
var bodyParser = require('body-parser');

// this is object deststructuring variable like require(mongoose.js) = {mongoose: 'somedata'}--
// so taking that mongoose and declaring as variable mongoose = (source of the data i.e moongoose.js)--
// which is automatically 'somedata'
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');
const {ObjectID} = require('mongodb');

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
    user: req.body.user,
    email: req.body.email
  });

  user.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/users', (req, res) => {
   User.find().then((users) => {
     res.send({users});
   }, (e) => {
     res.status(400).send(e);
   });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(e);
  })
});

//:id is the syntax for user input id or any key . req keeps all info  so req.params will get the user input value
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {//ObjectId is imported from mongodb not included so don't forget to declare.
    return res.status(404).send();//here id in invalid means its not thr right format.
  }
  Todo.findById(id).then((todo) => {
    if(!todo) { // if id is valid but doesnot contain the required
      return res.status(404).send(); // return is used to stop from any furthur code execution.
    }
    res.status(200).send({todo}); //returning in object means flexibility than array .
  }).catch((err) => { // this is done if the above promise chain gets any error while resolving the promises. But-
    res.status(400).send();//-need to findout more differences between catch and normal error method.
  });;

});



app.listen(3000, () => {
  console.log('server running at 3000')
});

module.exports = {app};
