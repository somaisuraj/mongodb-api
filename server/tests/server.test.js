const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');

const todos = [{
  _id: new ObjectID(),
  text: 'first todo'
}, {
  _id: new ObjectID(),
  text: 'second todo'
}];//this is seed data because beforeEach will run before other function
and will delete all data.
const users = [{
  _id: new ObjectID(),
  user: 'hunter',
  email:'hunter@gmail.com'

}, {
  _id: new ObjectID(),
  user :'surya',
  email: 'surya@yahoo.com'
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);//with retrun we can't call other then();
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create new todo',  (done) => {
       var text = 'test todo text';
       request(app)
       .post('/todos')
       .send({text})
       .expect(200)
       .expect((res) => {
          expect(res.body.text).toBe(text);
       })
       .end((e, res) => {
         if (e) {
           return done(e);
         }
         Todo.find({text}).then((todo) => {
           expect(todo.length).toBe(1);
           expect(todo[0].text).toBe(text);
           done();
         }).catch((e) => {
           done(e);
         }) ;
       })
  });

  it('should not create to do with invalid body data', (done) => {
      request(app)
      .post('/todos')
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
     .expect(200)
     .expect((res) => {
       expect(res.body.todos.length).toBe(2);
     })
     .end(done);
     // we are not doing async function so end is called with done;
   });


});

describe('GET /todos/:id', () => {
  it('should get the todos doc', (done) => {
          request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done);
  });
  it('should return 404 if todo is not found' ,(done) => {
          var id = new ObjectID();
          request(app)
          .get(`/todos/${id.toHexString()}`)
          .expect(404)
          .end(done);

  });

  it('should retun 404 for non-valid id', (done) => {
         // var id = '123';  we can define var also or we can  write/todos/123 directly since we want to have invalid id.
         request(app)
         .get('/todos/id')
         .expect(500)
         .end(done);
  });
});

describe('DELETE users/:id', () => {
    it('should delete the user by id', (done) => {
      var id = users[0]._id.toHexString();
      request(app)
      .delete(`/users/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.doc._id).toBe(id);
      })
      .end((err, res) => {
          if (err) {
            return done(err);
          }
          // we search in User model because User is the variable that stores users data .
          User.findById(id).then((doc) => {
            expect(doc).toNotExist();
            done();
          }).catch((err) => done(err));

    });
  });

    it('should return 404 if user not found', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
      .delete(`/users/${id}`)
      .expect(404)
      .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
      request(app)
      .delete('/users/id')
      .expect(404)
      .end(done);
    });
});
