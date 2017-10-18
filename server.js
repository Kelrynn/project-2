const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  path = require('path'),
	  request = require('request'),
	  passport = require('passport'),
	  flash = require('connect-flash'),
	  session = require('express-session'),
	  cookieParser = require('cookie-parser');

const YELP_ID = require('./env.js').YELP_CLIENT_ID;
const YELP_SECRET = require('./env.js').YELP_CLIENT_SECRET;

let YELP_TOKEN;


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

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


app.get('/', function (req, res) {
	console.log("GET '/'");
	res.render('index');
});

app.post('/location', function (req,response) {
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
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server Started on port 3000.");
});
