
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
http = require('http'),
app = express();

var apiKey = "ab0dc76da6bb6b1544448615fa4b00b1";


//path.join("projectOne/", "/public");
var views = path.join(process.cwd(), "/views");



/*CONFIG 
.js & .css files + vendor files*/
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));           

//Parse serialized data being posted
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());
// parse cookie data
app.use(cookieParser("Super Secret")); 

//Session Setup Process
app.use(session({ 
                  secret: keygen._({specials: true}),
                  resave: true,
                  saveUninitialized: true,

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
          console.log("user coming back", user)
            if(err) 
            {   
                console.log("current user validation error coming back");
                cb(err, null)
            }

//what is req.user = user?
            // req.user = user;
            console.log("Validation worked CB FS next user is equal to ", user);
            cb(null, user);
        })
    //End currentUser
    };

// logout the current user
    req.logout = function (){  
        
        req.session.userId = null;
        req.user = null;
    }
    //Next is needed to continue
    next();
    
});


/*View Routes*/

//Home View
app.get(["", "/" , "/home" ],function (req,res){

    // Uses currentUser Method to check if user is already signedIn
    req.currentUser(function (err, user) {
    
        if (user === null)
        {
            res.redirect("/login");
        }
        else
        {
            res.sendFile(path.join(views, "show.html"));
        }
    })

    // If new user session send login form
   

//End Home
});


// SignUp Form Route
app.get("/signup",function (req,res){

    console.log("user sign up form requested");
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
            res.redirect("/profile/"+user._id)
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

    if(!password){
        res.send("Missing Password")
    }
       


    // Call authenticate method inside user's model file which take 2 arg & 1 cb fs
    db.User.authenticate(username, password, function (err, user){
       
        if(user)
        {
            req.login(user);
            res.cookie("guid", user._id, { signed: true });
            res.redirect("/profile/"+user._id)
        }
        else
        {
            console.log("this is the error", err);

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
app.get("/profile/:id", function showProfile (req, res){
   
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


//Provides username to be displayed in the profile page
app.get("/username", function provideUsername (req, res){
    

    req.currentUser(function (err, user){
    
        if (user)
        {
            var userObj = {}
            userObj.username = user.username;
            userObj.city = user.city;
            res.send(userObj);
        }
    });
//End 
});

//Delete session
app.delete("/logout", function (req, res){
    
    console.log("hit the correct route");
    req.logout;
    res.redirect("/login");
});


/*City Routes*/

//Get City Info
app.get('/city', function (req, res) {
 
      var params = req.query.cityName;
      var cityName = params.replace(" ","+");

      console.log(cityName);

//   var options = {
//   host: 'www.google.com',
//   port: 80,
//   path: '/upload',
//   method: 'POST'
// };

      // response is not data is a cb function
      http.get('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + "&APPID=" + apiKey, function (response) {

                response.on("data", function(data){
                  console.log("data HERE", JSON.parse(data));
                  res.send(JSON.parse(data));
                })
      });

});



app.post('/city', function (req, res) {

    console.log("hitting the city route",  req.body);
     var cityName = req.body.city;
     console.log(`the city name is ${cityName}`);
     console.log("req.session.userID = ", req.session.userId);


     req.currentUser(function (err, user){

         if(err)
            {
                console.log("error is: ", err)
            }

            user.city.push(cityName);
            user.save(function(err, cityName){
            if(err){
                console.log("error is", err);
            }
            console.log("the songs were added to album: ", cityName);
            res.send(user.city);
            
        })

     })

})



// var listener = app.listen(3000, function () {
// console.log("Listening on port " + listener.address().port);
// });

// var port = Number(process.env.PORT || 3000);
var port = (process.env.PORT || 3000);
app.listen(port, function(){
    console.log("small weather app server listening at port 3000");
});