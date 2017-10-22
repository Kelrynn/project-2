const express = require('express');
const router = express.Router();
// Parses information from POST
const bodyParser = require('body-parser');
// Used to manipulate POST methods
const methodOverride = require('method-override');
const passport = require('passport');
let restaurantsController = require('../controllers/restaurantsController');
let userAuthenticationController = require('../controllers/userAuthenticationController');

function authenticatedUser(req, res, next) {
// If the user is authenticated, then we continue the execution
if (req.isAuthenticated()) return next();
// Otherwise the request is always redirected to the home page
res.redirect('/login');
}

//////////////
///	ROUTES ///
//////////////
router.route('/')
	.get(authenticatedUser, restaurantsController.loadingPage);

router.route('/location')
	.post(restaurantsController.displayRestaurants);

router.route('/login')
	.get(userAuthenticationController.get)
	.post(userAuthenticationController.postLogin);

router.route('/signup')
	.post(userAuthenticationController.postSignup);

router.route('/logout')
	.get(userAuthenticationController.logout);

router.route('/profile')
	.get(authenticatedUser, restaurantsController.getProfile);

router.route('/comments')
	.post(authenticatedUser, restaurantsController.newComment)
	.get(authenticatedUser, restaurantsController.getComments);

router.route('/restaurants')
	.post(authenticatedUser, restaurantsController.toggleRestaurant)
	.get(authenticatedUser, restaurantsController.sendList);

module.exports = router;