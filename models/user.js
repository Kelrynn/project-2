let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;

let User = mongoose.Schema({
	local : {
		email: String,
		password: String,
	},
	reviews: [{
		type: Schema.Types.ObjectId,
    	ref: 'Review'
	}],
	visited: [{
		type: Schema.Types.ObjectId,
		ref: 'Restaurant'
	}]
});

User.methods.encrypt = function (password) {
	console.log('encrypt()');
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

User.methods.validPassword = function (password) {
	console.log('validPassword()');
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);