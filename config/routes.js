const express = require('express');
const router = express.Router();
// Parses information from POST
const bodyParser = require('body-parser');
// Used to manipulate POST methods
const methodOverride = require('method-override');
const passport = require('passport');
let restaurantsController = require('../controllers/restaurantsController');
let userAuthenticationController = require('../controllers/userAuthenticationController');

//////////////
///	ROUTES ///
//////////////
router.route('/')
	.get(restaurantsController.loadingPage);

router.route('/location')
	.post(restaurantsController.displayRestaurants);

router.route('/login')
	.get(userAuthenticationController.get);

router.route('/signup')
	.post(userAuthenticationController.postSignup);

module.exports = router;