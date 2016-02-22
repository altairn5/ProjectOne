var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require("cookie-parser"),
    db = require('./models'),
    session = require('express-session'),
    path = require('path'),
    bcrypt = require('bcrypt'),
    keygen = require('keygenerator'),
    methodOverride = require('method-override'),
    app = express();

var views = path.join(process.cwd(), "/views");
            // or we can write 
            //path.join("projectOne/", "/public");
 // CONFIG //
// serve js & css files
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));           

//APPs
app.use(bodyParser.urlencoded({extended: true})); // parse POSTed data
app.use(cookieParser("Super Secret")); // parse cookie data

    //create The Session
app.use(session({
    //use keygen to generate a secret key
    secret: keygen._({specials: true}),
    resave: false,
    saveUninitialized: true

})
);
    //extending the request object to help manange sessions
app.use(function (req,res,next){
    //login a user
    req.login = function (user) {
        req.session.userId = user._id;
    };
    //find the current user
    req.currentUser = function (cb){
        db.User.findOne({_id: req.session.userId}, function (err, user) {
                    req.user = user;

                    cb(null, user);
                }
            )
    };
    //logout the current user
    req.logout = function () {  
        req.session.userId = null;
        req.user = null;
     }
     next();
});
    

//VIEWS


app.get("/home",function (req,res){

res.sendFile(path.join(views, "login.html"));

});


app.get("/signup",function (req,res){

res.sendFile(path.join(views, "signup.html"));

});

app.get("/login",function (req,res){

res.sendFile(path.join(views, "login.html"));

});

// app.get("/results", function (req, res){
// res.sendFile(path.join(views, "results.html"));
// });

// within the profile page
// FIND USER IN DB AND SHOW SCOREBAORDS
// VIA RES.SEND(SCOREBOARDDATA);
// app.get("/profile",function (req,res){
// // shows a specifi user
// // allow user to add a new scoreboard
// // allow user to view all of their saved scoreboards
// // allow user ot remove a scoreboard
// // allow user to update data in scorebaord
// res.sendFile(path.join(views, "profile.html"));

// });

// APP.POST FOR EACH Page

/*User Routes*/

//SignUp
app.post("/signup", function createUser(req, res){
  var username = req.body.username;
  var password = req.body.password;

  db.User.createSecure(username, password, function(err, user){
    if ( user ) {
        req.login(user);
      // res.cookie("guid", user._id, { signed: true });
      res.redirect("/profile")
    } else {
      res.redirect("/login");
    }
  })

});


//Login
app.post("/login", function newSession(req,res){
    var username = req.body.username;
    var password = req.body.password;

    db.User.authenticate(username, password, function (err, user){
        if  (user){
            req.login(user);
            // res.cookie("guid", user._id, { signed: true });
            res.redirect("/profile")
        }else{
            console.log(err);
            res.redirect("/login");
        }

    })
});

//Logout
app.get("/logout", function endSession (req,res){
    console.log("loggingout here")
    res.clearCookie("guid");
    res.redirect("/home");
});

//Show Profile

app.get("/profile", function showProfile (req, res){
    // var username = req.body.username;
    req.currentUser(function (err, user) {
    if (user === null) {
      res.redirect("/login")
    } else {
      res.sendFile(path.join(views, "profile.html"));
    }
  })
});
//Show Username
app.get("/username", function provideUsername (req, res){
    req.currentUser(function (err, user){
      if (user){
        res.send(user);
      }
    });


});
//Delete session
app.delete("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

//City Routes

// app.get('/results', function(req, res) {
//   var cityWeather = req.body.city;

//   request('http://api.openweathermap.org/data/2.5/weather?' + place, function(err, response, body) {
//       if(!err) {
//         var city = JSON.parse(body);
//         console.log(city);
//         res.render('results.ejs', {location: city});
//       }
//   });
// });
    var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});