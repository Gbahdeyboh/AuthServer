/**
* @package - Auth server
* @description - This is a simple auth server that authticates  a users data using redis and mongo db
* @author - Bello Gbadebo
* 
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const customEnv = require('custom-env').env();
const corsConfig = require("./config/cors");

const userRoute = require('./routes/users');

const authRoute = require('./routes/auth');


require('./config/mongo'); //connect to mongo database


app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(express.json());

/*****************************************************************************
***************
 *                                                                                           *
 * Cors is enabled so the client can acces enpoint on this API wthout having to make request *
 *  from the same Origin                                                                     *
 * read more about CORS here - https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS        *
 *                                                                                           *
 ********************************************************************************************/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsConfig.origins);
  res.header("Access-Control-Allow-Headers", corsConfig.headers);
  if (req.method === "OPTIONS") {
    //preflight request
    res.header("Access-Control-Allow-Methods", corsConfig.methods);
    return res.status(200).json({});
  }
  next();
});


/********************************************************************************************
 *                                                                                           *
 * Makes sure all enpoints from this application must be accessed through the api route      *
 * This would be in the format `<base-url>/api/v1/<required-route>`                          *
 *                                                                                           *
 ********************************************************************************************/

 app.use('/api/v1/', userRoute);
 app.use('/api/v1/', authRoute);




const port = process.env.PORT || 7600;
app.listen(port, () => console.log(`Listening on port ${port}`));