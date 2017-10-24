let mongoose = require('mongoose');

//review schema with references to user and restaurant
let ReviewSchema = mongoose.Schema({
	rating: Number,
	comment: String,
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant'
	}
});

let Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;