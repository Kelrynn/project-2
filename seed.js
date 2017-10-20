let mongoose = require('mongoose');
let db = require('./models');


let sampleReviews = [
	{
		rating: 4,
		comment: "Good",
		createdBy: "",
		restaurant: ""
	},
	{
		rating: 5,
		comment: "Excellent",
		createdBy: "",
		restaurant: ""
	},
	{
		rating: 2,
		comment: "Poor service",
		createdBy: "",
		restaurant: ""
	}
];
let sampleRestaurants = [
	{
		name: "El Farolito",
		display_phone: "123-123-1234",
		display_address: "123 Sesame St",
		reviews: []
	},
	{
		name: "La Bamba",
		display_phone: "987-456-1230",
		display_address: "420 Light Dr",
		reviews: []

	},
	{
		name: "Rat House",
		display_phone: "111-111-1111",
		display_address: "666 Sewa Pl",
		reviews: []

	}
];
let sampleUsers = [
	{
		local : {
			email: 'abc@abc.abc',
			password: 'abc',
		},
		reviews: [],
		visited: []
	},
	{
		local : {
			email: 'test@test.net',
			password: 'test',
		},
		reviews: [],
		visited: []

	},
	{
		local : {
			email: 'bob@b.com',
			password: 'bob',
		},
		reviews: [],
		visited: []

	}
];

//review>>restaurant>>user
db.Review.remove({}, function(err) {
	if(err) throw err;
	console.log("Removed Reviews");
	db.Restaurant.remove({}, function(err){
		if(err) throw err;
		console.log("Removed Restaurants");
		db.User.remove({}, function(err) {
			if(err) throw err;
			console.log("Removed Users");
			//create reviews
			let rev0 = new db.Review(sampleReviews[0]);
			let rev1 = new db.Review(sampleReviews[1]);
			let rev2 = new db.Review(sampleReviews[2]);
			//create restaurants and add reviews to each restaurant
			let rest0 = new db.Restaurant(sampleRestaurants[0]);
			let rest1 = new db.Restaurant(sampleRestaurants[1]);
			let rest2 = new db.Restaurant(sampleRestaurants[2]);
			rest0.reviews.push(rev0._id);
			rest1.reviews.push(rev1._id);
			rest2.reviews.push(rev2._id);
			//create users and add reviews and restaurants and encrpyt passwords
			let user0 = new db.User(sampleUsers[0]);
			let user1 = new db.User(sampleUsers[1]);
			let user2 = new db.User(sampleUsers[2]);	
			user0.reviews.push(rev0._id);
			user1.reviews.push(rev1._id);
			user2.reviews.push(rev2._id);
			user0.visited.push(rest0._id, rest1._id, rest2._id);
			user1.visited.push(rest0._id, rest1._id, rest2._id);
			user2.visited.push(rest0._id, rest1._id, rest2._id);
			user0.local.password = user0.encrypt(user0.local.password);
			user1.local.password = user1.encrypt(user1.local.password);
			user2.local.password = user2.encrypt(user2.local.password);
			//add creadted by into reviews now that users exist
			rev0.createdBy = user0._id;
			rev1.createdBy = user1._id;
			rev2.createdBy = user2._id;
			rev0.restaurant = rest0._id;
			rev1.restaurant = rest1._id;
			rev2.restaurant = rest2._id;
			rev0.save();
			rev1.save();
			rev2.save();
			rest0.save();
			rest1.save();
			rest2.save();
			user0.save();
			user1.save();
			user2.save();
			console.log("Created 3 reviews: " + rev0, rev1, rev2);
		});
	});
});