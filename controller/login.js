/**
* @description - This module is a middleware enables a user to login after verifying their email and password
*/
const Session = require('../services/redis');
const usersModel = require('../models/user');
const Respond = require('../services/responses');
const token = require('../routes/routesServices/token')();
const hash = require('../services/passwordHasher');

module.exports = (req, res, next) => {
	let data = req.body;
	let email = data.email;
	let password = data.password;
	usersModel.find({email})
	.then(user => {
		//Search for the sent email
		if(user.length >=0 && user[0] !== undefined){
			req.email = email;
			req.password = password;
			let passwordVerify = hash(password, email).hash;
			//if the email exists, hash the sent password
			if(user[0].password === passwordVerify){
				// If the password is correct , call the next middleware to sent the use appropriate information
				//Use has proven knowledge of the password.
				// Generate a token for the user and respond with his details
				let data = {
					"name" : user[0].name,
					"email" : user[0].email,
					"number": user[0].number,
					"_id" : user[0]._id,
					"created": user[0].created
				}
				req.data = data;
				next();
			}
			else{
				//If the user inputs a password email
				Respond(res).error(404, 'loginValidationError', 'Invalid email or password was provided', err);
			}
		}
		else{
			res.send(error);
		}
	})
	.catch(err => {
		//When a wrong email is inputted
		Respond(res).error(404, 'loginValidationError', 'Invalid email or password was provided', err);
	})
}