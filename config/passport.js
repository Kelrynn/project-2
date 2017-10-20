let LocalStrategy = require('passport-local').Strategy;
let db = require('../models');

module.exports = function(passport) {

	passport.serializeUser(function(user, callback) {
		console.log("serializeUser()");
		callback(null, user.id);
	});

	passport.deserializeUser(function(id, callback) {
		console.log("deserializeUser()");
		db.User.findById(id, function (err, user) {
			callback(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function (req, email, password, callback) {
		console.log("local-signup");
		db.User.findOne({'local.email' : email}, function (err, user) {
			if(err) return callback(err);
			if(user) {
				return callback(null, false, req.flash('message', 'That email is already in use.'));
			} else {
				let newUser = new db.User();
				newUser.local.email = email;
				newUser.local.password = newUser.encrypt(password);
				newUser.save(function(err) {
					if(err) throw err;
					return callback (null, newUser);
				});
			}
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function (req, email, password, callback) {
		console.log("local-login");
		db.User.findOne({'local.email' : email}, function (err, user) {
			if(err) callback(err);
			//wrong info
			if(!user || !(user.validPassword(password))){
				return callback(null, false, req.flash('message', 'Username or Password incorrect.'));
			}
			return callback(null, user);
		});
	}));
};