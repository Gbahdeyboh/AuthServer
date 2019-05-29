const usersModel = require('../models/user');
const Respond = require('../services/responses');

module.exports = (req, res, next) => {
	usersModel.find({email: req.data.email})
	.then(data => {
		if(data.length > 0){
			Respond(res).error(500, 'accountCreationError', `A user has already been registered with ${req.data.email}`, '')
		}
		else{
			usersModel.create(req.data)
			.then(data => {
				delete data.password;
				req.data = data;
				next();
			})
			.catch(err => {
				Respond(res).error(500, 'accountCreationError', `Could not create an account for ${data.data.email}`, err);
			})
		}
	})
	.catch(err => {
		Respond(res).error(500, 'accountCreationError', `Could not create an account for ${data.data.email}`, err);
	})
}