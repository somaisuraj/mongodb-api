const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, 'shristi');
console.log(token);

var decoded = jwt.verify(token, 'shristi');
console.log('decoded', decoded);
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
