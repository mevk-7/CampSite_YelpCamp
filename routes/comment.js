var express = require('express');
var router = express.Router();
var Campground = require("../models/Campground");
var Comments = require("../models/Comment");
var passport = require('passport');
var middlewareObj = require('../middleware');



/*
==================================
Comments Routes
==================================
*/

//New Route
router.get('/campground/:id/comments/new', middlewareObj.isLoggedIn, function(req,res){
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
router.post('/campground/:id/comments',middlewareObj.isLoggedIn, function(req,res){

	//Find specific campground by id
	Campground.findById(req.params.id,function(err,camp){
		
		if (err){
			console.log(err);
		}
		else{
			//Create comment coming from post request
			Comments.create(req.body.comment,function(err,comment){

				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				console.log(comment);
				//push comments in Camp
				camp.comments.push(comment);
				camp.save();
				res.redirect('/campground/'+camp._id);


			})
		}
	})

});

//Edit Routes
router.get('/campground/:id/comments/:comment_id/edit',middlewareObj.isCommentUser,function(req,res){
	Comments.findById(req.params.comment_id,function(err,foundComment){
		if (err){
			res.redirect('back');
		}
		else{
			res.render('comments/edit',{
				camp_id:req.params.id,
				comment:foundComment
			});
		}
	})

	
})
//Update routes
router.put('/campground/:id/comments/:comment_id',function(req,res){
	Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,body){
		if (err){
			res.redirect('back');
		}
		else{
			res.redirect('/campground/'+req.params.id);
		}
	})
})
//Delete Route
router.delete('/campground/:id/comments/:comment_id',function(req,res){
	Comments.findByIdAndRemove(req.params.comment_id,function(err,comment){
		if (err){
			res.rediret('back');
		}
		else{
			res.redirect('/campground/'+req.params.id);
		}
	})
})

module.exports = router;
