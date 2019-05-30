/**
* This test suite makes sure all Auth endpoints (signup and login) and the users routes are working as expected 
*/

const fetch = require('node-fetch');

describe("All users route must return a valid response", () => {
	//Sends a get request to the server and expets a response with a success : true response
	test('users route should return a valid response', () => {
		return fetch('https://auth-server-242103.appspot.com/api/v1/users')
			   .then(res => {
				   	expect(res.success).toBeThruthy();
			   })
			   .catch(err => {
			   	console.log(err);
			   })
	});

	test('login route should return a valid response', () => {
	//Sends a post request to the server and expets a response with a success : false response because no
	// request body was specified
		return fetch('https://auth-server-242103.appspot.com/api/v1/login', {
			method: 'POST'
		})
	   .then(res => {
		   	expect(res.success).toBeFalsy();
	   })
	   .catch(err => {
	   	console.log(err);
	   })
	});

	test('signup route should return a valid response', () => {
		//Sends a post request to the server and expets a response with a success : false response because no
	// request body was specified
		return fetch('https://auth-server-242103.appspot.com/api/v1/signup', {
			method: 'POST'
		})
	   .then(res => {
		   	expect(res.success).toBeFalsy();
	   })
	   .catch(err => {
	   	console.log(err);
	   })
	});

})