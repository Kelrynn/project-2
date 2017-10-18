const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  path = require('path'),
	  request = require('request'),
	  passport = require('passport'),
	  flash = require('connect-flash'),
	  session = require('express-session'),
	  cookieParser = require('cookie-parser');

const YELP_ID = require('./config/env.js').YELP_CLIENT_ID;
const YELP_SECRET = require('./config/env.js').YELP_CLIENT_SECRET;

let YELP_TOKEN;


// app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// app.use(passport.initialize());
// app.use(passport.session()); 
// app.use(flash()); 

let routes = require('./config/routes');
app.use(routes);

app.listen(process.env.PORT || 3000, function(){
	console.log("Server Started on port 3000.");
});
