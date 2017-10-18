const YELP_ID = require('../config/env.js').YELP_CLIENT_ID;
const YELP_SECRET = require('../config/env.js').YELP_CLIENT_SECRET;
const request = require('request');

let YELP_TOKEN;

//makes the API call to grab the OAuth2 Token from yelp
request.post({
  url: 'https://api.yelp.com/oauth2/token',
  form: {
    client_id: YELP_ID,
    client_secret: YELP_SECRET,
    grant_type: "client_credentials"
  }
}, function (err, httpResponse, body) { 
	body = JSON.parse(body);
	YELP_TOKEN = body.access_token;
	console.log(YELP_TOKEN);
});

function loadingPage(req, res, next) {
	console.log("GET '/'");
	res.render('index');
}

function displayRestaurants(req,response) {
	console.log("POST '/location'");
	console.log(`LOCATION: LAT: ${req.body.lat} LON: ${req.body.lon}`);
	let options = {
  		url: "https://api.yelp.com/v3/businesses/search?term=food&latitude="+ req.body.lat +"&longitude="+ req.body.lon +"&open_now=true&sort_by=rating&radius=5000",
	  	headers: {Authorization: "Bearer " + YELP_TOKEN}
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