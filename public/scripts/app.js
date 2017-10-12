console.log("Sanity Check: JS is working!");
$(function() {
	navigator.geolocation.getCurrentPosition(showPosition);
	// $('h2').html("Nearby Restaurants to: " + navigator.geolocation.getCurrentPosition());

	function showPosition(position) {
    	let lat = position.coords.latitude;
    	let lon = position.coords.longitude;
    	$('h2').html("Nearby Restaurants to : " + lat + ", "+ lon);

    	$.ajax({
    		url: '/',
    		type: 'post',
    		data: {lat,lon},
    	})
    	.done(function(data) {
    		console.log("successful post request");
    		window.location.href += "home";
    	})
    	.fail(function() {
    		console.log("error");
    	})
    	.always(function() {
    		console.log("completed request");
    	});
    	
	}
});