var express = require('express');
var router = express.Router();
var Campground = require('../models/Campground');
var Comments = require("../models/Comment");
var middlewareObj = require('../middleware');


/*
===================================
campgrounds routes
===================================
*/


//Index route
router.get('/campground',function(req,res){
	Campground.find({},function(err,camp){
		//console.log(camp);
		res.render('campgrounds/campground',{Campground:camp});

	})
});

//New route
router.get('/campground/new', middlewareObj.isLoggedIn, function(req,res){
	res.render('campgrounds/new');
});


//Create Route
router.post('/campground', middlewareObj.isLoggedIn, function(req,res){
	var img = req.body.img;
	var name = req.body.name;
	var description = req.body.description;
	//console.log(req.body);
	var author =  {
		id: req.user._id,
		username : req.user.username
	}

	Campground.create({name:name,image:img,description: description ,author:author},function(err,ret){
		res.redirect('/campground');
	})
});

//SHOW route

router.get('/campground/:id',function(req,res){
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

//Edit Routes
router.get('/campground/:id/edit',middlewareObj.isAuthorized,function(req,res){
	Campground.findById(req.params.id, function(err,foundCamp){
		if (err){
					console.log(err);
					res.redirect('/campground');
		}
		else{
			res.render('campgrounds/edit',{foundCamp:foundCamp});		
		}
	})
	
});

//Update Routes
router.put('/campground/:id',function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,camp){
		if (err){
			res.redirect('/campground');
		}
		else{
			//Show Page
			req.flash('success','Updated')
			res.redirect('/campground/'+req.params.id);
		}
	})
});

//Delete Routes
router.delete('/campground/:id',function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if (err)
		{	req.flash('error','Something went wrong!!!');
			res.redirect('/campground');
		}
		else{
			req.flash('success','Deleted')
			res.redirect('/campground');
		}
	})
});




	


module.exports = router;