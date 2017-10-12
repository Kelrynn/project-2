const expect = require('chai').expect,
	  request = require('request'),
	  ZOMATO_KEY = require('../env');


describe('zomato api',function(){
	let apiError,apiResponse, apiBody;
	let options = {
	  	url: "https://developers.zomato.com/api/v2.1/geocode?lat=39.758157&lon=-105.007294",
	  	headers: {"user-key": ZOMATO_KEY}
	};
	before(function(done) {
		request(options, function(err, res, body){
			apiError = err;
			apiResponse = res;
			apiBody = body;
			done();
		});
		
	});
	it('should give back 200 status code', function() {
		expect(apiResponse.statusCode).to.eq(200);
	});
	it('should give a list of restaurants near location', function() {
		apiBody = JSON.parse(apiBody);
		expect(apiBody.nearby_restaurants).to.not.be.empty;
	});
});


