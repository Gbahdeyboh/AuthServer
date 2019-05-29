const crypto = require('crypto');

/**
* @description - This module is used to hash literally anythin that might want to be hashed in a secure and irrvasible by building
* up on the power and cmplexity of the pdkdf2 hashing algorithm.
* @params EncryptPassword [Object] - An Object that hashes values given to it
* @property value [String] - The enitity being hashed
* @property  optionalSalt [String] - An optional parameter that is used for the salt of the hashing algorithm, if not passed, 
* a random hex salt is generated of the hashed value 
* @return [Object] - returns an object containing the the hashed value and its salt
* By default the hash is initially done using the given salt, 
* the hash is then hashed again by using the previous hash + the index  of the current hash as its new salt
* making the algorithm very powerful and secure
*/

function encryptPassword(value, optionalSalt){
    /*
      *The optional salt arguments is used when a user with an account wants to be authenticated
      *It is gotten from the database
      */
    let hashed = {}; 
    hashed.salt = crypto.randomBytes(16).toString('hex'); //Generate a salt
    //if optional salt is not provided, use the generated salt
    hashed.hash = crypto.pbkdf2Sync(value, optionalSalt || this.salt, 1000, 64, `sha512`).toString(`hex`);//hash the password
    for(let i = 0; i < 1000; i++){
      //Use the previous hash as a salt to the new hash and repeat this process a thousand times
      hashed.hash = crypto.pbkdf2Sync(hashed.hash, hashed.hash + i, 1000, 64, `sha512`).toString(`hex`);//hash the password
    }
    return {
        salt: optionalSalt || hashed.salt,
        hash: hashed.hash
    };
}


module.exports = (pass, optionalSalt) => encryptPassword(pass, optionalSalt);


