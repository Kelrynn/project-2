const express 		= require('express'),
	  app 			= express(),
	  bodyParser 	= require('body-parser'),
	  path 			= require('path'),
	  request 		= require('request'),
	  passport 		= require('passport'),
	  flash 		= require('connect-flash'),
	  session 		= require('express-session'),
	  cookieParser 	= require('cookie-parser'),
	  mongoose     	= require('mongoose'),
	  morgan       	= require('morgan');

require('dotenv').config();

app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser()); 

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(session({secret: "Hankertown P2 App"}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./config/passport')(passport);

let yelpToken = require('./controllers/yelpToken.js');
app.use(yelpToken);

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

let routes = require('./config/routes');
app.use(routes);



app.listen(process.env.PORT || 3000, function(){
	console.log("Server Started on port 3000.");
});
