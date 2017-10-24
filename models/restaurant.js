let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//restaurant schema with reference to an array of review objects
let RestaurantSchema = new Schema({
	name: String,
	display_phone: String,
	display_address: String,
	reviews: [{
		type: Schema.Types.ObjectId,
		ref: 'Review'
	}],
	restaurantId: String

});

let Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;