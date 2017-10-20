const request = require('request');
let db = require('../models');


function loadingPage(req, res, next) {
    console.log("GET '/'");
    res.render('index');
}

function displayRestaurants(req, response) {
    console.log(`LOCATION: LAT: ${req.body.lat} LON: ${req.body.lon}`);
    let options = {
        url: "https://api.yelp.com/v3/businesses/search?term=food&latitude=" + req.body.lat + "&longitude=" + req.body.lon + "&open_now=true&sort_by=rating&radius=5000",
        headers: { Authorization: "Bearer " + req.token }
    };
    request(options, function(err, res, body) {
        if (err) console.log("ERROR: " + err);
        let bod = JSON.parse(body);
        let restaurants = bod.businesses;
        response.render('restaurants', { restaurants });
    });
}

function getProfile(req, res) {
    let user = req.user;
    let revs = [user.reviews];
    let visited = [user.visited];
    let counter1 = 0;
    let counter2 = 0;

    //grab all restaurants the user has been to
    db.Restaurant.find({ _id: { $in: user.visited } }, function(err, restaurants) {
        visited = restaurants;
        let interval = setInterval(function() {
            if (counter1 >= visited.length && counter2 >= revs.length) {
                clearInterval(interval);
                console.log("RENDERING");
                res.render('profile', { user, reviews: revs, visited });
            }
            console.log(counter1);
            console.log(counter2);
        }, 10);
        //grab all the reviews for each restaurant
        visited.forEach((r, i) => {
            //find all reviews for each restaurant
            db.Review.find({ _id: { $in: r.reviews } }, function(err, reviews) {
                //add the real object into the restaurant object
                r.reviews = reviews;
                // add the restaurant object with populated reviews into visited array
                visited[i] = r;
                counter1++;
                console.log("visited: " + r);
            });
        });
        //find all reviews a user has made
        db.Review.find({ _id: { $in: user.reviews } }, function(err, reviews) {
            revs = reviews;
            //for each review
            reviews.forEach((r, i) => {
                //grab all restaurants that the reviews the user made match
                db.Restaurant.findById(r.restaurant, function(err, rest) {
                    //replace review's restaurant id with object
                    r.restaurant = rest;
                    //add the review to the reviews array
                    revs[i] = r;
                    counter2++;
                    console.log("reviews: " + r);
                });
            });
            //render the data
        });
    });
}


module.exports = {
    loadingPage: loadingPage,
    displayRestaurants: displayRestaurants,
    getProfile: getProfile
};