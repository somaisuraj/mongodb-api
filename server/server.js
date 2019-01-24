require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

// this is object deststructuring variable like require(mongoose.js) = {mongoose: 'somedata'}--
// so taking that mongoose and declaring as variable mongoose = (source of the data i.e moongoose.js)--
// which is automatically 'somedata'
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');
const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

// new  is creating the model instance of Todo varaiable which is model in source file
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
 var body = _.pick(req.body, ['user', 'email', 'password']);
 var user = new User(body); //we already defined the parameter for the object constructor

 user.save().then(() => {
  return user.generateAuthToken();
 }).then((token) => {
   res.header('x-auth', token).send(user);
 }).catch((err) => {
   res.status(400).send(err);
 });
 });

 app.get('/users/me', authenticate , (req, res) => {
  res.send(req.user);

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
    return res.status(500).send();//invalid means that the id  is not in correct format.
  }
  Todo.findById(id).then((todo) => {
    if(!todo) { // if id is valid but doesnot contain data
      return res.status(404).send(); // return is used to stop from any furthur code execution.
    }
    res.status(200).send({todo}); //returning in object means flexibility than array .
  }).catch((err) => { // this is done if the above promise chain gets any error while resolving the promises. But-
    res.status(400).send();//-need to findout more differences between catch and normal error method.
  });;

});

app.delete('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }
  User.findByIdAndDelete(id).then((doc) => {
    if (!doc) {
      return res.status(404).send('Doc not Found');
    }
    res.status(200).send({doc});
  }).catch((err) => {
    res.status(400).send('Unknown error', err);
  });

});

app.patch('/todos/:id', (req , res) => {
   var id = req.params.id;

   // _.pick lets the user only update the data inside []
   // body is getting data from req.body and picking only text and completed property to be available to user
   var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }
  // isBoolean is checking the result for true or false and body.completed means boolean result true(if exists)
  if (_.isBoolean(body.completed) && body.completed) {
         body.completedAt = new Date().getTime();
    } else {
      body.completedAt = null; // setting to null or resetting the previous data
      body.completed = false;
    }
  Todo.findByIdAndUpdate(id,{$set: body},{new: true} //this means return original false i.e returns the updated object.
  ).then((todo) => {
     if (!todo) {
        return res.status(404).send('No todo for the given id');
     } res.send({todo});
  }).catch((err) => {
    res.status(400).send(err);
  });

});
app.patch('/users/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['user','email','completed']);
  if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid ID');
  }
  if (_.isBoolean(body.completed) && body.completed) {
       body.completedAt = new Date();

  } else {
    body.completedAt = null;
    body.complete = false;
  }
  //this below code should be written outside if statement, otherwise it will run after completed is set true.
  User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
      if (!user) {
          return res.status(404).send('user not found');
      }res.status(200).send({user});
  }).catch((err) => {
    res.status(400).send(err);
  });
});


app.listen(port, () => {
  console.log(`started at ${port}`);
});

module.exports = {app};
