'use strict';

$(function () {
	console.log("SANITY CHECK");
	$('.cardForm').hide();
	if (window.location.href === 'http://localhost:3000/') {
		$.get('/restaurants', function (data) {
			console.log(data);
			var cards = $('.card');
			console.log(cards);
			for (var i = 0; i < cards.length; i++) {
				for (var j = 0; j < data.length; j++) {
					if (cards[i].attributes['1'].value === data[j].restaurantId) {
						$(cards[i]).find('.toggleRestaurant:first').toggleClass('btn-success btn-danger').html('-');
					}
				}
			}
		});
	}
	$('.card').on('click', '.toggleRestaurant', function (event) {
		var button = $(this);
		var restaurant = {};
		var $card = $(this.closest('.card'))[0];
		restaurant.restaurantId = $card.attributes['1'].value;
		var $data = $(this.closest('.card'))[0].children[0].children;
		restaurant.name = $data[0].innerText;
		var info = $data[1].innerText.split('\n');
		restaurant.display_phone = info[0];
		restaurant.display_address = info[1];
		$.ajax({
			url: '/restaurants',
			type: 'POST',
			data: { restaurant: restaurant }
		}).done(function (data) {
			console.log(data);
			button.toggleClass('btn-success btn-danger');
			if (button.hasClass('btn-success')) {
				button.html('+');
			} else {
				button.html('-');
			}
		}).fail(function () {
			console.log("error");
		}).always(function () {
			console.log("complete");
		});
	});

	$('.card').on('click', '.comments', function (event) {
		var card = $(this.closest('.card'));
		var restaurantId = $(this.closest('.card'))[0].attributes['1'].value;
		$.ajax({
			url: '/comments?r=' + restaurantId,
			type: 'get'
		}).done(function (data) {
			console.log("success " + data);
			card.find('.cardForm').slideToggle('fast');
		}).fail(function () {
			console.log("error");
		}).always(function () {
			console.log("complete");
		});
	});
	$('.cardForm').on('submit', function (event) {
		event.preventDefault();
		$.ajax({
			url: '/comments?' + $(this).serialize(),
			type: 'POST'
		}).done(function (data) {
			console.log(data);
		}).fail(function () {
			console.log("error");
		}).always(function () {
			console.log("complete");
		});
	});
});