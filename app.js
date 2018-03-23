var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/Campground");
var Comments = require("./models/Comment");
var User     = require('./models/user');
var seedDB = require("./seed");
var passport =require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');
mongoose.connect('mongodb://localhost/my_database_Yelcamp_v5');


var app = express();

var campgroundRoutes = require('./routes/campground'),
	commentRoutes 	 = require('./routes/comment'),
	indexRoutes 	 = require('./routes/index');


app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

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
	res.locals.error= req.flash('error');
	res.locals.success = req.flash('success');
	next();
});


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);









app.listen(3001,function(){
	console.log('server started!!!');
});