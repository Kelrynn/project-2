'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$(function () {
	console.log("SANITY CHECK");
	$('.cardForm').hide();
	//only load this section at a current location
	//this $.get changes the + buttons to - buttons if a user has been there before. works on reload.
	if (window.location.href === 'http://localhost:3000/' || window.location.href === 'https://protected-dusk-42319.herokuapp.com/') {
		$.get('/restaurants', function (data) {
			var cards = $('.card');
			for (var i = 0; i < cards.length; i++) {
				for (var j = 0; j < data.length; j++) {
					if (cards[i].attributes['1'].value === data[j].restaurantId) {
						$(cards[i]).find('.toggleRestaurant:first').toggleClass('btn-success btn-danger').html('-');
					}
				}
			}
		});
	}
	//click listener for the + - button. adding and removing a restaurant to user list
	$('.card').on('click', '.toggleRestaurant', function (event) {
		var button = $(this);
		var restaurant = {};
		var card = $(this).closest('.card');
		restaurant.restaurantId = card.attr('restaurantId');
		restaurant.name = card.children().children().eq(1)[0].innerText;
		var data = card.children().children().eq(2)[0].innerText.split('\n');
		restaurant.display_phone = data[0];
		restaurant.display_address = data[1];
		$.ajax({
			url: '/restaurants',
			type: 'POST',
			data: { restaurant: restaurant }
		}).done(function (data) {
			//dom manipulation when data comes back
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
	//click listener for comments display button
	$('.card').on('click', '.comments', function (event) {
		var card = $(this.closest('.card'));
		var restaurantId = $(this.closest('.card'))[0].attributes['1'].value;
		$.ajax({
			url: '/comments?r=' + restaurantId,
			type: 'get'
		}).done(function (data) {
			//load all the comments if they exist. dom manipulation.
			console.log("success");
			var comments = $('<div>');
			data.forEach(function (r) {
				var review = $('<div>').html('<p><b>' + r.createdBy + ':</b> ' + r.rating + ' stars! \n' + r.comment + '</p>').addClass('review col');
				comments.append(review);
			});
			card.find('.comment_section').empty().append(comments);
			card.find('.cardForm').slideToggle('fast');
		}).fail(function () {
			console.log("error");
		}).always(function () {
			console.log("complete");
		});
	});
	//on submit a new comment from form data.
	$('.cardForm').on('submit', function (event) {
		event.preventDefault();
		var form = $(this);
		$.ajax({
			url: '/comments?' + $(this).serialize(),
			type: 'POST'
		}).done(function (data) {
			console.log(data);
			if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object') {
				form.slideToggle('slow');
				form[0].reset();
			} else {
				var alert = $('<div>').addClass('alert alert-danger').html(data);
				form.prepend(alert);
			}
		}).fail(function () {
			console.log("error");
		}).always(function () {
			console.log("complete");
		});
	});
});