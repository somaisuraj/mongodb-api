var env = process.env.NODE_ENV || 'development';
 if (env === 'development' || env === 'test') {
   var config = require('./config.json');
   var envConfig = config[env];// when we want to use variable to access a property we must use bracket

   Object.keys(envConfig).forEach((key) => {//it takes an object and gets all of the keys and  returns them as array.
     process.env[key] = envConfig[key];
   });
 }

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
