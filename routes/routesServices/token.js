const jwt = require('jsonwebtoken');
function tokens(){
	this.generateToken = function(req, res, next){
		return new Promise((resolve, reject) => {
			jwt.sign(req.data, req.data.email, (err, token) => {
				if(err){
					reject(Error(err));
				}
				else if(token){
					resolve(token);
					req.token = token;
					next();
				}
			})
		})
	}
}

module.exports = () => new tokens();