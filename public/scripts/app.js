'use strict';

console.log("Sanity Check: JS is working!");
$(function () {
    navigator.geolocation.getCurrentPosition(showPosition);
});

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    $.ajax({
        url: '/location',
        type: 'post',
        data: { lat: lat, lon: lon }
    }).done(function (data) {
        console.log("successful post request");
        $('body').replaceWith(data);
    }).fail(function () {
        console.log("error with request");
    }).always(function () {
        console.log("completed request");
    });
}