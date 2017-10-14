const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  path = require('path'),
	  request = require('request'),
	  ZOMATO_KEY = require('./env.js').ZOMATO_API_KEY,
	  YELP_ID = require('./env.js').YELP_CLIENT_ID,
	  YELP_SECRET = require('./env.js').YELP_CLIENT_SECRET;

let YELP_TOKEN;



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use(express.static('public'));

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
});


app.get('/', function (req, res) {
	console.log("GET '/'");
	res.render('index');
});

app.post('/location', function (req,response) {
	console.log("POST '/location'");
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
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server Started on port 3000.");
});
