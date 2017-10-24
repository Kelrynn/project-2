$(function() {
	console.log("SANITY CHECK");
	$('.cardForm').hide();
	if (window.location.href === 'http://localhost:3000/' || window.location.href === 'https://protected-dusk-42319.herokuapp.com/') {
		$.get('/restaurants', function(data){
			let cards = $('.card');
			for (let i = 0; i < cards.length; i++){
				for (var j = 0; j < data.length; j++) {
					if (cards[i].attributes['1'].value === data[j].restaurantId){
						$(cards[i]).find('.toggleRestaurant:first')
							.toggleClass('btn-success btn-danger')
							.html('-');
					}
				}
			}
		});
	}
	$('.card').on('click', '.toggleRestaurant', function(event){
		let button = $(this);
		let restaurant = {};
		let card = $(this).closest('.card');
		restaurant.restaurantId = card.attr('restaurantId');
		restaurant.name = card.children().children().eq(1)[0].innerText;
		let data = card.children().children().eq(2)[0].innerText.split('\n');
		restaurant.display_phone = data[0];
		restaurant.display_address = data[1];
		$.ajax({
			url: '/restaurants',
			type: 'POST',
			data: {restaurant},
		})
		.done(function(data) {
			console.log(data);
			button.toggleClass('btn-success btn-danger');
			if (button.hasClass('btn-success')){
				button.html('+');
			} else {
				button.html('-');
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	});

	$('.card').on('click', '.comments', function(event){
		let card = $(this.closest('.card'));
		let restaurantId = $(this.closest('.card'))[0].attributes['1'].value;
		$.ajax({
			url: '/comments?r='+restaurantId,
			type: 'get',
		})
		.done(function(data) {
			console.log("success");
			let comments = $('<div>');
			data.forEach(r => {
				let review = $('<div>').html("<b>"+r.createdBy+"</b>"+ ": " + r.rating + " " + r.comment).addClass('review col');
				comments.append(review);
			});
			card.find('.comment_section').empty().append(comments);
			card.find('.cardForm').slideToggle('fast');
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	});
	$('.cardForm').on('submit',function(event) {
		event.preventDefault();
		let form = $(this);
		$.ajax({
			url: '/comments?' + $(this).serialize(),
			type: 'POST',
		})
		.done(function(data) {
			console.log(data);
			if(typeof(data) == 'object') {
				form.slideToggle('slow');
				form[0].reset();
			} else {
				let alert = $('<div>').addClass('alert alert-danger').html(data);
				form.prepend(alert);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	});
	
});






