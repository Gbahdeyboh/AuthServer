/**
* @description - This module is used to create a login session using a redis cache as storage for users
* @param Session [Object] - Can be used to create a session and set a ession for new users
*/

const redis = require('redis');
const client = redis.createClient({
          host : process.env.host,  
          no_ready_check: true,
          auth_pass: process.env.auth_pass,
          port: 11192                                                                                        
});

function Session(redisClient){

	//connect to a redis instance 
	redisClient.on('connect', function() {
	    console.log('Redis client connected');
	});

	//When there is a connection error
	redisClient.on('error', function (err) {
	    console.log('Something went wrong ' + err);
	});

	return {
		//Set a new session using the email as key
		set : function(email, token){
				redisClient.set(email, token, redis.print);
		},
		//getthe set session using the users email
		get : async function(email){
			let token;
			let getTokenPromise = new Promise((resolve, reject) => {	
				redisClient.get(email, function(err, result){
					if(err){
						reject(err);
					}
					if(result){
						token = result
						resolve(result);
					}
				})
			})
			await getTokenPromise;
			return token;
		}
	}
}

let session = Session(client)
// session.set('emal', 'token');

module.exports = session;

