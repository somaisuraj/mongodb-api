// const MongoClient = require('mongodb').MongoClient;
//
// MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {
//   if(error) {
//     return console.log('Unable to connect.', error);
//   }
//   console.log(' hunter you are connected to mongodb');
//   const db = client.db('TodoApp');
//
//   db.collection('Todos').insertOne({
//     text: 'something to do',
//     completed: false
//   }, (error, result) => {
//      if (error) {
//         return console.log('unable to insert todo', error);
//      }
//
//      console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//   client.close();
// });
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
  if(error) {
    return console.log('unable to connect to mongodb server', error);
  } console.log('connected to mongodb server');
  const db = client.db('TodoApp');
  db.collection('Users').insertOne({
    name: 'suraj',
    age: 30,
    location: 'Butwal'
  }, (error, result) => {
    if (error) {
         return console.log('could not insert data into database', error);
    }
    console.log('success', result.ops);
  });
client.close();
});
