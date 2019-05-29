const usersModel = require('../models/user');
const Respond = require('../services/responses');

module.exports = (req, res, next) => {
	usersModel.find({_id: req.params.id})
	.then(data => {
		req.user = data[0];
		next();
	})
	.catch(err => {
		Respond(res).error(404, 'userError', 'The user with the specified id can not be found', err);
	})
}