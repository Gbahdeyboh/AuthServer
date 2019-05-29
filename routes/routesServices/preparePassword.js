/**
* This module validates the users password and makes sure a secue password is being sent to the server, 
* after validation, it goes ahead to hash this password using a pbkdf2 secure hashing algorith before appending 
* this data to the request object for fyrther processing.
*/
const Respond = require('../../services/responses');
const hash = require('../../services/passwordHasher');

module.exports = (req, res, next) => {
	const body = req.body; //The user sent data 
	const password = body.password; 
	const email = body.email;

	if(!password || !email){
		//Make sure the password  and email was sent with the data
		res.status(400).json({});
	}
	else if(password.length < 8){
		// Make sure the sent password is atleast 8 characters long
		Respond(res).error(400, 'passwordValidationError', 'Password must be atleast 8 characters long', '');
	}
	else if(!password.match(/[0-9]/gi)){
		// the sent password must contain atleats a number
		Respond(res).error(400, 'passwordValidationError', 'Password must contain atleast a number', '');
	}
	else if(!password.match(/[A-Z]/g)){
		//The pasword must contain atleast an uppercase letter
		Respond(res).error(400, 'passwordValidationError', 'Password must contain atleast an uppercase letter', '');
	}
	else{
		//If everything goes fine and password is validated, hash the password and apppend it to the requst object
		body.password = hash(body.password, body.email).hash;
		req.data = body;
		next();
	}
}