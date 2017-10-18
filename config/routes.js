const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
let restaurantsController = require('../controllers/restaurantsController');

//////////////
///	ROUTES ///
//////////////
router.route('/')
	.get(restaurantsController.loadingPage);

router.route('/location')
	.post(restaurantsController.displayRestaurants);

//router.route('/login')
//	.get(userAuthenticationController.get);

module.exports = router;