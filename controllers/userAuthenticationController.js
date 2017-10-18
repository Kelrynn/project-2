let passport = require('passport');
function get(req, res, next) {
	console.log("get controller'");
	res.render('login');
}

function postLogin(req, res, next) {

}

function postSignup(req, res, next) {
	console.log('postSignup controller');
	let signupStrategy = passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	});
	return signupStrategy(req, res, next);
}



module.exports = {
	get: get,
	postLogin: postLogin,
	postSignup: postSignup
};