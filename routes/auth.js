/** 
* @description - this module handles ethe roures for reating an account and logging into an account
*/

const express = require('express');
const app = express();
const usersModel = require('../models/user');
const Respond = require('../services/responses');
const preparePassword = require('./routesServices/preparePassword');
const token = require('./routesServices/token')();
const register = require('../controller/register');
const login = require('../controller/login');
const Session = require('../services/redis');

//Create a new account for a user
app.post('/signup', preparePassword, token.generateToken, register, (req, res, next) => {
	//If everything works fine and the account is created, remove the password hash from the data sent back to the user
	let data = {
		"name" : req.data.name,
		"email" : req.data.email,
		"number": req.data.number,
		"_id" : req.data._id,
		"created": req.data.created
	}
	//Create a session for the user using a redis client as db and store the authentication token 
	// of this user in a redis database
	Session.set(data.email, req.token);

	//respond with the users data
	Respond(res).success({
		data, 
		token : req.token,
	})

});

//Log user in

app.post('/login', login, token.generateToken, (req, res, next) => {
	//Create a session for the user using a redis client as db and store the authentication token 
	// of this user in a redis database
	Session.set(req.data.email, req.token);

	Respond(res).success({
		data : req.data,
		token : req.token,
	});
});




module.exports = app;