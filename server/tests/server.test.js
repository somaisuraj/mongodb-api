const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'first todo'
}, {
  text: 'second todo'
}];//this is seed data because beforeEach will run before other function
// and will delete all data.

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
