let mongoose = require('mongoose');

let ReviewSchema = mongoose.Schema({
	rating: Number,
	comment: String
});

let Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;