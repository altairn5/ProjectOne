var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/projectOne3");
var City = require('./city');
var User = require('./user');

module.exports.City = City;
module.exports.User = User;