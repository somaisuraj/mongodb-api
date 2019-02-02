const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');
const {todos, populateTodos,users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create new todo', (done) => {
       var text = 'something newTodo';

       request(app)
       .post('/todos')
       .set('x-auth', users[0].tokens[0].token)
       .send({text})
       .expect(200)
       .expect((res) => {
          expect(res.body.text).toBe(text);
       })
       .end((e, res) => {
         if (e) {
           return done(e);
         }
         Todo.find({text}).then((todos) => {
           expect(todos.length).toBe(1);
           expect(todos[0].text).toBe(text);
           done();
         }).catch((e) => {
           done(e);
         }) ;
       })
  });

  it('should not create to do with invalid body data', (done) => {
      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(e);
        }
        Todo.find().then((todo) => {
          expect(todo.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET/users', () => {
   it('should get all users from get user route', (done) => {
     request(app)
     .get('/users')
     .expect(200)
     .expect((res) => {
       expect(res.body.users.length).toBe(2);
     })
     .end(done);
   });
});
describe('GET/todos', () => {
   it('should get all todos', (done) => {
     request(app)
     .get('/todos')
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res) => {
       expect(res.body.todos.length).toBe(1);
     })
     .end(done);
     // we are not doing async function so end is called with done;
   });


});

describe('GET /todos/:id', () => {
  it('should get the todos doc', (done) => {
          request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done);
  });
  it('should not get the todos doc', (done) => {
          request(app)
          .get(`/todos/${todos[1]._id.toHexString()}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(404)
          .end(done);

});
  it('should return 404 if todo is not found' ,(done) => {
          var id = new ObjectID();
          request(app)
          .get(`/todos/${id.toHexString()}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(404)
          .end(done);

  });

  it('should retun 404 for non-valid id', (done) => {
         // var id = '123';  we can define var also or we can  write/todos/123 directly since we want to have invalid id.
         request(app)
         .get('/todos/id')
         .set('x-auth', users[0].tokens[0].token)
         .expect(500)
         .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo ', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token )
    .expect(200)
    .expect((res) => {
      //res.body is the body we receive .so it is req.body: {}
    //}} this is the format
      expect(res.body._id).toBe(todos[0]._id.toHexString());
    }).end((err, res) => {
      if (err) {
       return done(err);
      }
       Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          done();
       }).catch((err) => done());
    });
  });
  it('should not delete the todo if different user login', (done) => {
    var todo1 = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${todo1}`)
    .set('x-auth', users[0].tokens[0].token )
    .expect(404)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findOne({_creator: todos[1].id}).then((todo) => {
        expect(todo).toBeTruthy();
        done();
      }).catch((err) => done());
    });
  });
  it('should return 404 if id is invalid', (done) => {
    request(app)
    .delete('/todos/id')
    .set('x-auth', users[0].tokens[0].token )
    .expect(404)
    .end(done);
  });
  it('should return 404 if todo is not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token )
    .expect(404)
    .end(done);
  });
});

describe('DELETE users/:id', () => {
    it('should delete the user by id', (done) => {
      let id = users[0]._id.toHexString();
      request(app)
      .delete(`/users/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.user._id).toBe(id);//here user because we are sending ({user})not (user)
      })
      .end((err, res) => {
          if (err) {
            return done(err);
          }
          // we search in User model because User is the variable that stores users data .
          User.findById(id).then((user) => {
            expect(user).toBeFalsy();
            done();
          }).catch((err) => done(err));

    });
  });

    it('should return 404 if user not found', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
      .delete(`/users/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
      request(app)
      .delete('/users/id')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });
});

describe('PATCH todos/:id', () => {
   it('should update the todo', (done) => {
       var id = todos[0]._id.toHexString()
       var text = "this text is required to test update";
       request(app)
       .patch(`/todos/${id}`)
       .set('x-auth', users[0].tokens[0].token)
       .send({  // testing for update and no updater  data . so above text is created.
         completed: true, //send sends the data to the server to update.
         text
       })
       .expect(200)
       .expect((res) => { //this res is available because res.send({todo}) gives us res and  becomes res.body: todo; so res.body.todo
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
       })
       .end(done);
   });

   it('should not update the todo created by different user', (done) => {
       var id = todos[0]._id.toHexString()
       var text = "this text is required to test update";
       request(app)
       .patch(`/todos/${id}`)
       .set('x-auth', users[1].tokens[0].token)
       .send({// testing for update and no updater  data . so above text is created.
         completed: true, //send sends the data to the server to update.
         text
       })
       .expect(404)
        .end(done);
   });

   it('should clear completedAt when todo is not completed', (done) => {
      var id = todos[1]._id.toHexString();
      var text = 'this is checking for completedAt';
      request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
   });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)//setting the header with name and value
                   // tokens is array with length 1 and at index 0. so tokens[0].token
    .expect(200)
    .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        console.log(res.body);
        expect(res.body.user).toBe(users[0].user);//this was showing undefined because in user schema i had only chose id and email -
        expect(res.body.email).toBe(users[0].email);//-so after adding user parameter in pick() then it worked like charm
    })
    .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
      request(app)
      .get('/users/me')
      .expect(500)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST /users', () => {
  it('should create user', (done) => {
     var user = 'suraj';
     var email = 'somai.suraj@yahoo.com';
     var password = '123abc';

     request(app)
     .post('/users')
     .send({user, email, password})
     .expect(200)
     .expect((res) => {
       expect(res.headers['x-auth']).toBeTruthy();
       expect(res.body._id).toBeTruthy();
       expect(res.body.email).toBe(email);
       expect(res.body.user).toBe(user);


     })
     .end((err) => {
       if (err) {
         return done(err);
       }
       User.findOne({email}).then((user) => {
         expect(user).toBeTruthy();
         expect(user.password).not.toBe(password);
         done();//dont't forget to pass done
       }).catch((e) => {
            return done(e);
       });

     });
  });
  it('should return validation error', (done) => {
      var user = 'hunter';
      var email = 'surajsomai.com';
      var password = 'abc123';
      request(app)
      .post('/users')
      .send({user, email, password})
      .expect(400)
      .end(done);
      // no need to do end(() => {}) because expect 400 is there and all.
    });
  it('should not create user if email is in use', (done) => {
    request(app)
    .post('/users')
    .send({
      user: 'surajj',
      email: users[0].email,
      password: '123abc'
    })
    .expect(400)
    .end(done);

  });
  it('should not create user if username is in use', (done) => {
    request(app)
    .post('/users')
    .send({
      user:users[0].user,
      email: "somai.surajjjj@gmail.com",
      password: '234567jdj'
    })
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
      request(app)
      .post('/users/login')
      .send({ email: users[1].email, password : users[1].password })
      //we need email and password becauseof post and we _.pick with email, password
      .expect(200)
      .expect((res) => {
        //use square bracket because of hypen - in the text.
        expect(res.header['x-auth']).toBeTruthy();//i.e checking if exist or not
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toMatchObject({//toInclude//since there is now 2 token because of default and generated token. so -
            access:'auth',                      //-now latest token at 1 not 0 because we are doing token.push method.
            token: res.header['x-auth']
          });
          done();
        }).catch((e) => {//catch is need because without we don't know what went wrong
          return done(e);
        });

      });
  });
  it('should reject invalid login', (done) => {
     request(app)
     .post('/users/login')
     .send({email: users[1].email, password: '123abc'}) //invalid login meand invalid data sent
     .expect(400)//because of invalid data it is 400
     .expect((res) => {
       expect(res.header['x-auth']).toBeFalsy();
     })
     .end((err, res) => {
       User.findById(users[1]._id).then((user) => {//findbyid need id not email
         console.log(user);
         expect(user.tokens.length).toBe(1);//
         done();
       }).catch((err) => done(err));
  });
});
});

describe('DELETE users/me/token', () => {
  it('should delete the token from the user when logout', (done) => {
      request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
            return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});
