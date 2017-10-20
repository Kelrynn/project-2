const request = require('request');
let db = require('../models');


function loadingPage(req, res, next) {
	console.log("GET '/'");
	res.render('index');
}

function displayRestaurants(req,response) {
	console.log(`LOCATION: LAT: ${req.body.lat} LON: ${req.body.lon}`);
	let options = {
  		url: "https://api.yelp.com/v3/businesses/search?term=food&latitude="+ req.body.lat +"&longitude="+ req.body.lon +"&open_now=true&sort_by=rating&radius=5000",
	  	headers: {Authorization: "Bearer " + req.token}
	};
	request(options, function(err, res, body){
		if (err) console.log("ERROR: " + err);
		var bod = JSON.parse(body);
		let restaurants = bod.businesses;
		response.render('restaurants',{restaurants});
	});
}

function getProfile(req, res) {
	let user = req.user;
	db.Review.find({_id: {$in: user.reviews}},function(err, reviews){
		res.render('profile', {user, reviews});
	});
}


module.exports = {
	loadingPage: loadingPage,
	displayRestaurants: displayRestaurants,
	getProfile: getProfile
};