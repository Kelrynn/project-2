let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: String,
	password: String,
	reviews: [{
		type: Schema.Types.ObjectId,
    	ref: 'Review'
	}],
	visited: [{
		type: Schema.Types.ObjectId,
		ref: 'Restaurant'
	}]
});

let User = mongoose.model('User', UserSchema);

User.methods.encrypt = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

User.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = User;