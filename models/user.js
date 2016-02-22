// var CityObjects = require("./cities.js");
// var City = CityObjects.model;
// var CitySchema = CityObjects.Schema;


// require dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    City = require('./city');
    bcrypt = require('bcrypt');


var userSchema = new Schema({
  username: String,
  passwordDigest: String,
  city: [City.schema]
});

userSchema.statics.createSecure = function (username, password, cb){
	// `_this` now references our schema
  var _this = this;
  // generate some salt
  bcrypt.genSalt(function (err, salt) {
    // hash the password with the salt
    bcrypt.hash(password, salt, function (err, hash) {
      // build the user object
      var user = {
        username: username,
// 	passwordDigest: hash?
        passwordDigest: hash
      };
      // create a new user in the db with hashed password and execute the callback when done
      _this.create(user, cb);
    });
  });
};



// userSchema.statics.authenticate = function(username, password, cb) {
// //this refers to the schema
// //find user by username entered at log in
//   this.findOne({username: username}, function(err, user){
//   // throw error if can't find user
//       if ( user === null ){
//         cb("Username does not exist", null);
//          // if found user, check if password is correct
//  //   } else if (user.checkPassword(password)) you can use user.checkPassword
//  //to check the password or the way below to give the password incorrect error
//       } else if ( user.password !== password ){
//         cb("Incorrect password", null);
//       } else {
//         cb(null, user);
//       }
//   });
// };
// Another way
 userSchema.statics.authenticate = function (username, password, cb) {
//   // find user by email entered at log in
  console.log("username is", username);
  this.findOne({username: username}, function (err, user) {
    // throw error if can't find user
    if (user === null) {
      cb("Can't find user with that email", null);
    // if found user, check if password is correct
    } else if (user.checkPassword(password)) {
      // the user is found & password is correct, so execute callback
      // pass no error, just the user to the callback
      cb(null, user);
    } else {
      // user found, but password incorrect
      // cb("password incorrect", user) would let user in regarless of password
      cb("password incorrect", null)
    }
  });
 }; 
 //COMPARE PASSWORDS
 userSchema.methods.checkPassword = function (password){
 	 // run hashing algorithm (with salt) on password to compare with stored `passwordDigest`
  // `compareSync` is like `compare` but synchronous
  // returns true or false

 	return bcrypt.compareSync(password, this.passwordDigest);
 };

// var Scoreboard = mongoose.model('Scoreboard', ScoreboardSchema);
var User = mongoose.model('User', userSchema);
module.exports = User;