const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {
  if(error) {
    return console.log('Unable to connect.', error);
  }
  console.log(' hunter you are connected to mongodb');
  const db = client.db('TodoApp');
  db.collection('Users').find({name:"hunter"}).toArray().then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
  }, (error) => {
    console.log('couldnot find the data', error);
  });

  });
