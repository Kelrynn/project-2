const expect = require('chai').expect,
	  request = require('request'),
	  ID = require('./env.js').YELP_CLIENT_ID,
	  SECRET = require('./env.js').YELP_CLIENT_SECRET;



describe('api',function(){
	let apiError,apiResponse, apiBody, YELP_TOKEN;
	before(function(done) {
		request.post({
		  url: 'https://api.yelp.com/oauth2/token',
		  form: {
		    client_id: ID,
		    client_secret: SECRET,
		    grant_type: "client_credentials"
		  }
		}, function (err, httpResponse, body) { 
			body = JSON.parse(body);
			YELP_TOKEN = body.access_token;
			let options = {
			  	url: "https://api.yelp.com/v3/businesses/search?location=Denver",
			  	headers: {Authorization: "Bearer " + YELP_TOKEN}
			};
			request(options, function(err, res, body){
				if (err) console.log("ERROR: " + err);
				apiError = err;
				apiResponse = res;
				apiBody = body;
				done();
			});
		});
		
		
	});
	it ("should retrieve id from env.js", function() {
		expect(ID).to.not.be.empty;
	});
	it ("should retrieve secret from env.js", function() {
		expect(SECRET).to.not.be.empty;
	});
	it ('should recieve a valid token', function () {
		expect(YELP_TOKEN).to.not.eq("");
	})
	it('should give back 200 status code', function() {
		expect(apiResponse.statusCode).to.eq(200);
	});
	it('should give a list of restaurants near location', function() {
		apiBody = JSON.parse(apiBody);
		expect(apiBody.businesses).to.be.an('array');
	});
});


