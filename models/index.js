var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI||"mongodb://localhost/projectOne3");

// mongoose.connect(process.env.MONGOLAB_URI ||
//     process.env.MONGOHQ_URL || 'mongodb://localhost/projectOne3');

var City = require('./city');
var User = require('./user');

module.exports.City = City;
module.exports.User = User;