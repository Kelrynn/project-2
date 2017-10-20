let mongoose = require('mongoose');

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