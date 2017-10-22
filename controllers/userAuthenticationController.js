let passport = require('passport');
let mongoose = require('mongoose');

function get(req, res, next) {
	console.log("get controller'");
	res.render('login', {message : req.flash('message')});
}

function postLogin(req, res, next) {
	let loginStrategy = passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	});
	return loginStrategy(req, res, next);
}

function postSignup(req, res, next) {
	console.log('postSignup controller');
	let signupStrategy = passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	});
	return signupStrategy(req, res, next);
}

function logout(req, res, next) {
	req.logout();
	res.redirect('/');
}

module.exports = {
	get: get,
	postLogin: postLogin,
	postSignup: postSignup,
	logout: logout,
};