console.log("Sanity Check: JS is working!");
$(function() {
        navigator.geolocation.getCurrentPosition(showPosition);   
});

function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    $('h2').html("Nearby Restaurants to: " + lat + ", " + lon);

    $.ajax({
        url: '/location',
        type: 'post',
        data: {lat,lon},
    })
    .done(function(data) {
        console.log("successful post request");
        $('body').replaceWith(data);
    })
    .fail(function() {
        console.log("error with request");
    })
    .always(function() {
        console.log("completed request");
    });
}