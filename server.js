
/*Require dependecies*/
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


//path.join("projectOne/", "/public");
var views = path.join(process.cwd(), "/views");

/*CONFIG 
.js & .css files + vendor files*/
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));           

//Parse serialized data being posted
app.use(bodyParser.urlencoded({extended: true})); 
// parse cookie data
app.use(cookieParser("Super Secret")); 

//Session Setup Process
app.use(session({ secret: keygen._({specials: true}),
                  resave: false,
                  saveUninitialized: true
                })
);



/* extending the request object to help manange sessions*/
app.use(function (req,res,next){
    
    //Login user method
    req.login = function (user) {
        
        console.log(user._id);
        req.session.userId = user._id;
    //End login     
    };

    // currentUser method
    req.currentUser = function (cb){

        //Looks for user in the db
        db.User.findOne({_id: req.session.userId}, function (err, user) {
            if(err) 
            {
                cb(err, null)
            }

            req.user = user;
            cb(null, user);
        })
    //End currentUser
    };

// logout the current user
    req.logout = function () {  
        
        req.session.userId = null;
        req.user = null;
    }
    //Next is needed to continue
    next();
    
});


/*View Routes*/

//Home View
app.get("/home",function (req,res){

    // Uses currentUser Method to check if user is already signedIn
    if(req.currentUser)
    {
        res.sendFile(path.join(views, "profile.html"));
    }

    // If new user session send login form
    res.sendFile(path.join(views, "login.html"))

//End Home
});


// SignUp Form Route
app.get("/signup",function (req,res){

    res.sendFile(path.join(views, "signup.html"));

//End
});


//Loging Form Route
app.get("/login",function (req,res){

    res.sendFile(path.join(views, "login.html"));

//End
});


/*User Routes*/

//Create New User Route
app.post("/signup", function createUser(req, res){
    
    var username = req.body.username;
    var password = req.body.password;

   /* Call createSecure method inside user's model file which take 2 arg & 1 cb fs 
    and execute cb fs*/
    db.User.createSecure(username, password, function(err, user){
        
       /* Once user has been created and send back we use the req.login 
        method to create a new session*/
        if ( user )
        {
            req.login(user);
            res.cookie("guid", user._id, { signed: true });
            res.redirect("/profile")
        }
        else 
        {
            res.redirect("/login");
        }

    //End of createSecure    
    })
// End createUser
});


// New Session Route
app.post("/login", function newSession(req,res){
    
    var username = req.body.username;
    var password = req.body.password;

    // Call authenticate method inside user's model file which take 2 arg & 1 cb fs
    db.User.authenticate(username, password, function (err, user){
       
        if(user)
        {
            req.login(user);
            res.cookie("guid", user._id, { signed: true });
            res.redirect("/profile")
        }
        else
        {
            console.log(err);
            res.redirect("/login");
        }

    })
});


//End Session Route
app.get("/logout", function endSession (req,res){

    // Call req.logout method above
    req.logout;
    res.redirect("/login");
});


//Show Profile Route
app.get("/profile", function showProfile (req, res){
   
    // var username = req.body.username;
    req.currentUser(function (err, user) {
    
        if (user === null)
        {
            res.redirect("/login")
        }
        else
        {
            res.sendFile(path.join(views, "show.html"));
        }
    })
});


//Show Username Route Not used yet
app.get("/username", function provideUsername (req, res){
    

    req.currentUser(function (err, user){
    
        if (user)
        {
            res.send(user);
        }
        res.redirect('/login');
    });
//End 
});

//Delete session
app.delete("/logout", function (req, res){
    
    console.log("hit the correct route");
    req.logout;
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