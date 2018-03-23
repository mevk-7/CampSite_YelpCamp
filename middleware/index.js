var Campground = require("../models/Campground");
var Comments = require("../models/Comment");

module.exports = {
	//MiddleWare
	isLoggedIn : function(req,res,next){
		if (req.isAuthenticated()){
			return next();
		}
		req.flash('error','You need to logged in first!');
		res.redirect('/login');
	},
	isCommentUser: function(req,res,next){
		if (req.isAuthenticated()){
			Comments.findById(req.params.id,function(err,comment){
				if (err){
					res.render('back');
				}
				else{
					if (comment.author.id.equals(req.user._id)){
						next();
					}
					else{
						req.flash('error','You are not authorized to do that !!!');
						res.render('back');
					}
				}
			})

		}
		else{
			req.flash('error','You need to logged in first!');
			res.redirect('back');
		}
	},


	isAuthorized:function(req,res,next){
		if (req.isAuthenticated()){
			Campground.findById(req.params.id,function(err,foundCamp){
				if (err){
					res.render('back');
				}
				else{
					if (foundCamp.author.id.equals(req.user._id)){
						next();
					}
					else{
						req.flash('error','You are not authorized to do that !!!');
						res.render('back');
					}
				}
			})

		}
		else{
			req.flash('error','You need to logged in first!');
			res.redirect('back');
		}
	}
}