var mongoose = require('mongoose');

var CampgroundSchema = mongoose.Schema({
	name: String,
	image : String,
	description :String,
	author :{
		id:{
			type :mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments :[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref :'Comment'
		}
	]
	
});
//Campground
module.exports = mongoose.model("Campground",CampgroundSchema);