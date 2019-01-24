const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = '123abc';
// bcrypt.genSalt(10, (err, salt) => {//adding random numbers upto 10 to password
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// });

let hashedPassword = '$2a$10$S.mvvpsWH4kLvrnIhvmfbuQRjxTsSYTyYpULL3qrURol9s2f5EIni';

bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log(result);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, 'shristi');
// console.log(token);
//
// var decoded = jwt.verify(token, 'shristi');
// console.log('decoded', decoded);
//  var message = 'I just did what i had to do in sunday';
//  var hashedMessage = SHA256(message).toString();
//  console.log(`message:${message}`);
//  console.log('*****');
//  console.log(`message:${hashedMessage}`);
// ///just for playing
// var data = {
//   id : 44 //when assigning value to object use colon not =. remember idiot.
// };
//
// var token = {
//   data,// data: data
//   hash: SHA256(JSON.stringify(data) +'somesecret').toString()//here semicolon generates error because it insode object.
// }
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) +'somesecret').toString();
// if (resultHash === token.hash) {
//      console.log('Data is untouched. Trusted');
// } else {
//   console.log('Data changed. Don\'t trust');
// }
