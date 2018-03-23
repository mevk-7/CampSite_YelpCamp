var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var passport = require('passport');

/*
============================================
*/
//Landing page
router.get('/',function(req,res){
	res.render('campgrounds/landing');
	console.log(req.user);
});
/*
============================================
*/


/*
============================================
Auth Routes
============================================
*/

//show register form
router.get('/register',function(req,res){
	res.render('Auth/register');
});

//Handle regiter
router.post('/register',function(req,res){
	console.log(req.body);
	//res.send("signing you up");
	var newUser = new User({username:req.body.username});

	User.register(newUser,req.body.password,function(err,user){
		if (err){
			console.log(err);
			req.flash('error',err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req,res,function(){

		});res.redirect('/campground');
	})
});

//Login form
router.get('/login',function(req,res){
	res.render('Auth/login');
});


//handling Login logic

router.post('/login',

	passport.authenticate('local',
		{
			successRedirect:'/campground',
			failureRedirect:'/login'
		}),
	function(req,res){

});

//Logout route
router.get('/logout',function(req,res){
	req.logout();
	req.flash('success','Logged you out!!')
	res.redirect('/campground');
});


//MiddleWare
function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}
module.exports = router;