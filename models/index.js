let mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/hankertown');

module.exports.User = require('./user');
module.exports.Review = require('./review');
module.exports.Restaurant = require('./restaurant');