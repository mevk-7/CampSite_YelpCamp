var mongoose = require('mongoose');

var CampgroundSchema = mongoose.Schema({
	name: String,
	image : String,
	description :String,
	comments :[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref :'Comment'
		}
	]
	
});
//Campground
module.exports = mongoose.model("Campground",CampgroundSchema);