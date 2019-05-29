/**
* @description - This module is used to handle the routes for updating, deleting and getting users details
*/ 
const express = require('express');
const app = express();
const usersModel = require('../models/user');
const findUser = require('../controller/users');
const Session = require('../services/redis');
const Respond = require('../services/responses');
const verifyToken = require('./routesServices/verifyToken');

//Read user details
app.get('/users/:id', findUser, (req, res, next) => {
	res.send(req.user);
});

app.get('/users', (req, res, next) => {
	usersModel.find()
	.then(ress => res.send(ress))
	.catch(err => res.send(err));
});

//Update a user detail
app.put('/users/update/:id', findUser, verifyToken, updateDetails, (req, res, next) => {
	Respond(res).success({
		data: req.user,
		message: "User information was successfully updated"
	})
});

//Delete a user from the collection
app.delete('/users/delete/:id', findUser, verifyToken, (req, res, next) => {
	let id = req.params.id;
	//Find the use by it's id
	usersModel.findOneAndRemove({_id: id})
	.then(data => {
		Respond(res).success({
			data: data,
			message: "User has been successfully deleted"
		})
	})
	.catch(err => {
		res.send(err);
	})
});

function updateDetails(req, res, next){
	let id = req.params.id;
	let data = req.body;
	usersModel.findByIdAndUpdate(id, data)
	.then(user => {
		// res.send({user});
		next();
	})
	.catch(err => {
		res.send(err);
	})
}



module.exports = app;	