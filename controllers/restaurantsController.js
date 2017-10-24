const request = require('request');
const db = require('../models');


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

function toggleRestaurant(req, res) {
    let user = req.user;
    let done = false;
    let removed = false;
    let match = false;

    //find the restaurant
    db.Restaurant.findOne({ restaurantId: req.body.restaurant.restaurantId }, function(err, restaurant) {
        let interval = setInterval(function() {
            if (done) {
                //should only execute if a restaurant exists but it is not linked to the current user
                clearInterval(interval);
                //add to user list
                user.visited.push(restaurant._id);
                //save
                user.save();
                //return restaurant to the frontend
                res.json(restaurant);
            } else if (removed) {
                clearInterval(interval);
            }
        }, 1);
        //if it exists
        if (restaurant) {
            console.log("found restaurant");
            //find all user's restaurants they visited
            db.Restaurant.find({ _id: { $in: user.visited } }, function(err, restaurants) {
                //for each restaurant
                for (var i = 0; i < restaurants.length; i++) {
                    console.log("loop");
                    // if they match
                    if (restaurants[i].restaurantId === restaurant.restaurantId) {
                        //remove the current restaurant from the user
                        user.visited.splice(i, 1);
                        //save
                        user.save();
                        res.send("Removed.");
                        clearInterval(interval);
                        match = true;
                    }
                    if (i === restaurants.length - 1 && !match) {
                        console.log("COnditional");
                        done = true;
                    }
                }
            });
            if (user.visited.length === 0) {
                console.log("empty array");
                done = true;
            }
        } else {
            console.log("Making new db entry for restaurant");
            db.Restaurant.create(req.body.restaurant, function(err, restaurant) {
                user.visited.push(restaurant._id);
                user.save();
                res.json(restaurant);
            });
        }
    });
    // if not linked:link to user.
    //if linked => unlink;

}

function newComment(req, res) {
    let match = false;
    //find user
    db.User.findOne({ _id: req.user._id }, function(err, user) {
        console.log(user);
        db.Restaurant.findOne({ restaurantId: req.query.restaurantId }, function(err, restaurant) {
            console.log(restaurant);
            //find restaurant
            //compare to see if user has been to restaurant
            if (restaurant)
                user.visited.forEach(r => {
                    console.log('Comparing: ' + JSON.stringify(r) + " and " + JSON.stringify(restaurant._id));
                    if (JSON.stringify(r) == JSON.stringify(restaurant._id)) {
                        match = true;
                        console.log("MATCH!");
                        let review = new db.Review(req.query);
                        user.reviews.push(review._id);
                        restaurant.reviews.push(review._id);
                        user.save();
                        restaurant.save();
                        review.createdBy = user._id;
                        review.restaurant = restaurant._id;
                        review.save();
                        res.json(review);
                    }
                });
            if (!match)
                res.send("Visit this restaurant before posting a review!");

        });
    });
}

function getComments(req, res) {
    console.log("getComments()");
    let done = false;
    let revs = [];
    let interval = setInterval(function() {
        console.log("interval!");
        if (done) {
            clearInterval(interval);
            res.json(revs);
        }
    }, 1);
    let id = req.query.r;
    //grab the restaurant by id
    db.Restaurant.findOne({ restaurantId: id }, function(err, restaurant) {
        console.log(restaurant);
        if (restaurant === null || restaurant.reviews.length === 0  ) done = true;
        //grab all reviews in the restaurant
        else db.Review.find({ _id: { $in: restaurant.reviews } }, function(err, reviews) {
            console.log(reviews);
            //grab the user who made the comment
            reviews.forEach(r => {
                db.User.findOne({ _id: r.createdBy }, function(err, user) {
                    console.log(user);
                    let rev = {
                        _id: r._id,
                        restaurant: r.restaurant,
                        createdBy: user.local.email,
                        rating: r.rating,
                        comment: r.comment
                    };
                    console.log(rev);
                    revs.push(rev);
                    done = true;
                });
            });
        });

    });
}

function sendList(req, res) {
    db.User.findOne(req.user, function(err, user) {
        db.Restaurant.find({ _id: { $in: user.visited } }, function(err, restaurants) {
            res.json(restaurants);
        });
    });
}

function editComment(req, res) {
    let comment = req.body;
    db.Review.findOne({_id: comment.id}, function(err, review){
        review = comment;
        review.save();
        res.json(review);
    });
}

function deleteComment(req, res) {
    let id = req.body.id;
    db.Review.find({_id: id}, function (err, review){
        db.Restaurant.findOne({_id: review.restaurant}, function(err, restaurant){
            db.User.findOne({_id: review.createdBy}, function (err, User){
                let indexRest = restaurant.reviews.indexOf(review._id);
                let indexUser = user.reviews.indexOf(review._id);
                user.reviews.splice(indexUser,1);
                user.save();
                restaurant.reviews.splice(indexRest,1);
                restaurant.save();
                db.Review.remove(review, function(err){
                    res.send("Deleted comment");
                });
            });
        });
    });
}

function getInfo(req, res) {
    let _id = req.params.id;
    db.Restaurant.findOne({_id}, function (err, restaurant){
        res.json(restaurant);
    });
}

function editRestaurant(req ,res) {
    let _id = req.params.id;
    let rest = req.body;
    db.Restaurant.findOne({_id}, function(err, restaurant){
        restaurant = rest;
        restaurant.save();
        res.json(restaurant);
    });
}

module.exports = {
    loadingPage,
    displayRestaurants,
    getProfile,
    getComments,
    toggleRestaurant,
    sendList,
    newComment,
    editComment,
    deleteComment,
    getInfo,
    editRestaurant
};