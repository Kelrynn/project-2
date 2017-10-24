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

//the home page
router.route('/')
	.get(authenticatedUser, restaurantsController.loadingPage);

//this route is only hit when the user is on the landing page
router.route('/location')
	.post(restaurantsController.displayRestaurants);

//user auth
router.route('/login')
	.get(userAuthenticationController.get)
	.post(userAuthenticationController.postLogin);

//user auth
router.route('/signup')
	.post(userAuthenticationController.postSignup);

//user auth
router.route('/logout')
	.get(userAuthenticationController.logout);

//display profile page
router.route('/profile')
	.get(authenticatedUser, restaurantsController.getProfile);

//crud routes for comments
router.route('/comments')
	.post(authenticatedUser, restaurantsController.newComment)
	.get(authenticatedUser, restaurantsController.getComments)
	.put(authenticatedUser, restaurantsController.editComment)
	.delete(authenticatedUser, restaurantsController.deleteComment);

//restaurant routes
router.route('/restaurants')
	.post(authenticatedUser, restaurantsController.toggleRestaurant)
	.get(authenticatedUser, restaurantsController.sendList);

//show one restaurant and edit routes
router.route('/restaurants/:id')
	.get(restaurantsController.getInfo)
	.put(authenticatedUser, restaurantsController.editRestaurant);

module.exports = router;