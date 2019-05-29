/**
* @description - This module is a middleware that makes sure only a logged in user is able to view other users profile
*/
const Session = require('../../services/redis');
const Respond = require('../../services/responses');
//Make sure there is a token and verify the token before proceeding
function verifyToken(req, res, next){
	const authorizationHeader = req.headers['authorization']; //Authorization headers
    if(authorizationHeader){
        const sentToken = authorizationHeader.split(' ').pop();
        const userData = req.user;
        //Verify token with jwt
        let userToken = Session.get(userData.email);
        userToken.then(uToken => {
	        if(sentToken === uToken){
	        	next();
	        }
	        else{
		        Respond(res).error(401, 'authenticationError', 'Invalid token specified in request authorizations', '');
	        }
        })
    }
    else{ 
        //If Authorization headers are not sent
        Respond(res).error(400, 'authenticationError', 'Invalid request headers: Authorization missing in request header', '');
    }
}

module.exports = verifyToken;