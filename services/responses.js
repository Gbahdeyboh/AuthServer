function responses(res){
	this.error = function (status, type, message, err){
		res.status(status).json({
			success: false,
			error: {
				code: status,
				type,
				message,
				err
			}
		})
	}
	this.success = function(payload){
		res.status(200).json({
			success: true,
			payload: payload
		})
	}
}

module.exports = (res) => new responses(res);