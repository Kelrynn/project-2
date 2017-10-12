const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  path = require('path'),
	  request = require('request'),
	  ZOMATO_KEY = require('./env.js');


let userLocation = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use(express.static('public'));


app.get('/', function (req, res) {
	console.log("GET '/'");
	res.render('index');
});

app.get('/home', function (req,response) {
	console.log("GET '/home'");
	let options = {
	  	url: "https://developers.zomato.com/api/v2.1/geocode?lat="+ userLocation.lat +"&lon="+ userLocation.lon +"",
	  	headers: {"user-key": ZOMATO_KEY}
	};
	request(options, function(err, res, body){
		if (err) console.log("ERROR: " + err);
		var bod = JSON.parse(body);
		console.log(bod);
		response.render('restaurants',{data:bod.nearby_restaurants});
	});
});

app.post('/', function(req,res){
	console.log("POST '/'");
	userLocation = req.body;
	res.redirect("/home");
});

app.listen(3000, function(){
	console.log("Server Started on port 3000.");
});
