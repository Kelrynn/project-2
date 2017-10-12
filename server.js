const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use(express.static('public'));


app.get('/', function (req, res) {
	res.render('index');
});

app.listen(3000, function(){
	console.log("Server Started on port 3000.");
});
