function get(req, res, next) {
	console.log("GET '/login'");
	res.render('login');
}

module.exports = {
	get: get
};