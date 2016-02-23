
/*Required dependencies*/

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
City = require('./city');
bcrypt = require('bcrypt');


var userSchema = new Schema(
  {
    username: String,
    passwordDigest: String,
    city: [City.schema]
  }
);

/* createSecure Method for secured passwords */

userSchema.statics.createSecure = function (username, password, cb){
      
      // `_this` now references UserSchema
      var _this = this;

      // We could specify salt "work factor" before cb fs
      //ex.   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      bcrypt.genSalt(function (err, salt) {

            if(err){
              return next(err);
            }
          // hash the password with the salt
            bcrypt.hash(password, salt, function (err, hash) {
              
                if(err){
                  return next(err);
                }
              // build the user object
                var user = {username: username,
                            //  passwordDigest: hash?
                            passwordDigest: hash
                           };
                //Create a new user in the db with hashed password and execute the callback when done
                _this.create(user, cb);
            //End bcrypt hash
            });
    // End of salt
    });
   //End createSecure   
  };


/* Authenticate Method to check if correct user */

userSchema.statics.authenticate = function (username, password, cb) {

    //Find user object using the username
    this.findOne({username: username}, function (err, user) {

        // throw error if can't find user
        if (user === null) 
          {
          cb("Can't find user with that email", null);
          } 
        
        //If user is found use checkPassword methd
        if(user)
        {
            user.checkPassword(password, function(err, isMatch){

                if(err)
                {
                    throw err;
                } 

                console.log("password ", isMatch);

                //End cb fs inside CP method  
                })

        
        // User is found & password is correct, so execute callback
        // err = null, pas user to server.js as arg in the cb fs
        cb(null, user);
        } 

        // If user found, but password incorrect
        else 
        {
            // err = "password incorrect", user = null send back to the server.js
            cb("password incorrect", null)
        }
    
    //End find user method    
    });

//End Authenticate method    
}; 
    

/*checkPassword Method to compare password entered at login by user */

userSchema.methods.checkPassword = function (password, cb){
    
    /* run hashing algorithm (with salt) on password to compare with stored `passwordDigest`
       `compareSync` is like `compare` but synchronous
       returns true or false */
    bcrypt.compareSync(password, this.passwordDigest, function(err, isMatch ){
        
        if(err)
        {
            return cb(err);
        }

        cb(null, isMatch);

    //End compareSync   
    });
 //End checkPassword   
};

//Export User Model
var User = mongoose.model('User', userSchema);
module.exports = User;





