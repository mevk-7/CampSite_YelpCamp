var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/Campground");
var Comments = require("./models/Comment");
var User     = require('./models/user');
var seedDB = require("./seed");
var passport =require('passport');
var LocalStrategy = require('passport-local');
mongoose.connect('mongodb://localhost/my_database_Yelcamp_v5');


var app = express();



app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');

seedDB();

/*
===================================
Authentication
===================================
*/

app.use(require('express-session')({
	
	secret:"This sentences is used as encription key",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	next();
});
/*
===================================
campgrounds routes
===================================
*/
//Landing page
app.get('/',function(req,res){
	res.render('campgrounds/landing');
	console.log(req.user);
});

//Index route
app.get('/campground',function(req,res){
	Campground.find({},function(err,camp){
		//console.log(camp);
		res.render('campgrounds/campground',{Campground:camp});

	})
});

//New route
app.get('/campground/new',function(req,res){
	res.render('campgrounds/new');
});


//Create Route
app.post('/campground',function(req,res){
	var img = req.body.img;
	var name = req.body.name;
	var description = req.body.description;
	//console.log(req.body);

	Campground.create({Camp:name,img:img,description: description},function(err,ret){
		res.redirect('/campground');
	})
});

//SHOW route

app.get('/campground/:id',function(req,res){
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec(function(err,foundCampground){
		if (err){
			console.log(err);
		}
		else{
			//console.log(foundCampground);
			res.render("campgrounds/show",{body:foundCampground});
		}

	})
});

/*
==================================
Comments Routes
==================================
*/

//New Route
app.get('/campground/:id/comments/new', isLoggedIn, function(req,res){
	//Find specific campground by id
	//console.log(req.params.id);
	Campground.findById(req.params.id,function(err,camp){
		//console.log(camp);
		if (err){
			console.log(err);
		}
		else{
			res.render('comments/new',{body:camp});
		}
	})
});


//Create Route
app.post('/campground/:id/comments',isLoggedIn, function(req,res){

	//Find specific campground by id
	Campground.findById(req.params.id,function(err,camp){
		
		if (err){
			console.log(err);
		}
		else{
			//Create comment coming from post request
			Comments.create(req.body.comment,function(err,comment){
				//push comments in Camp
				camp.comments.push(comment);
				camp.save();
				res.redirect('/campground/'+camp._id);


			})
		}
	})

});


/*
============================================
Auth Routes
============================================
*/

//show register form
app.get('/register',function(req,res){
	res.render('Auth/register');
});

//Handle regiter
app.post('/register',function(req,res){
	console.log(req.body);
	//res.send("signing you up");
	var newUser = new User({username:req.body.username});

	User.register(newUser,req.body.password,function(err,user){
		if (err){
			console.log(err);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req,res,function(){

		});res.redirect('/campground');
	})
});

//Login form
app.get('/login',function(req,res){
	res.render('Auth/login');
});

//handling Login logic

app.post('/login',

	passport.authenticate('local',
		{
			successRedirect:'/campground',
			failureRedirect:'/login'
		}),
	function(req,res){

});

//Logout route
app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/campground');
});


//MiddleWare
function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

app.listen(3000,function(){
	console.log('server started!!!');
});