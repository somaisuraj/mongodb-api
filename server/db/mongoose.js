const mongoose = require('mongoose');
// to use promise
mongoose.promise = global.promise;

// useNewUrlParser is neede although its no use for now
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {mongoose};//i.e mongoose: mongoose es6 feature
