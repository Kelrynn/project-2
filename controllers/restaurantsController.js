const request = require('request');

function loadingPage(req, res, next) {
	console.log("GET '/'");
	res.render('index');
}

function displayRestaurants(req,response) {
	console.log("POST '/location'");
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

module.exports = {
	loadingPage: loadingPage,
	displayRestaurants: displayRestaurants
};