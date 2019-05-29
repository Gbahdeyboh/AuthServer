const express = require('express');
const app = express();
const mongoose = require('mongoose');

const url = app.get('env') == "production" ? true/*To be updated later*/ : "mongodb://localhost:27017/AuthServer" /*MLab url here */ ;

console.log("Environment is ", app.get('env'));

mongoose.connect(url, {
        useNewUrlParser: true
    })
    .then(success => console.log("Connection to mongoose successful"))
    .catch(err => console.error("Could not connect to mongoose ", err));

mongoose.set('useCreateIndex', true);

process.on('exit', () => {
	mongoose.close();
})


module.exports = mongoose;