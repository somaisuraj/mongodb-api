const{MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true}, (error, client) =>{
  if (error) {
     return console.log('unable to connect to mongodb server', error);
  } console.log('connected to mongodb server');
  const db = client.db('TodoApp');
  db.collection('Users').findOneAndDelete({ location: 'Butwal'}).then((result) => {
    console.log(result);
  }, (error) => {
    console.log(error);
  });
});
