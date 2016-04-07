var mongoose = require("mongoose");
mongoose.connect("mongodb://altairn5:colombia1999@ds019470.mlab.com:19470/heroku_f5663tt4"||"mongodb://localhost/projectOne3");

// mongoose.connect(process.env.MONGOLAB_URI ||
//     process.env.MONGOHQ_URL || 'mongodb://localhost/projectOne3');
var City = require('./city');
var User = require('./user');

module.exports.City = City;
module.exports.User = User;