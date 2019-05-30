# <center> A Basic Auth Server </center>

![welcome gif](https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.gif)

## Introduction

Welcome to the AuthServer API, the AuthServer API is a very basic authentication server API that uses redis and mongo db to authenticate users. With the server, users can create an account, login to their accounts, display other users, delete their accounts and also update it. I would try to make this basic tutorial as fun as i can, by giving fun coding examples and illustrations to explain how to consume the API and how the server works underneath.

Before we proceed, i would love us to create an imaginary person (Mr Alamu). Mr Alamu is a business man that would love to use our API services to manage his authentication problems. Below are the essential details of Mr Alamu.

```javascript
{
    "name": "Alamu Obo Langido",
    "email": "langido@gmail.com",
    "number": "09041941941",
    "password": "Alamu_4_Langido"
}
```

<table><tr><td width="65%" style="float: left; font-size: 2em;">Mr Alamu wishes to create an account on our platform but does not want to write code yet, Mr Alamu wants to make sure our Endpoints work as we say it does before getting his hands dirty with code. <br /><br />But how is this possible?</td><td width="35%"><img src="https://media.giphy.com/media/xUPGcmF2iGsTGEFVL2/giphy.gif" width="350" height="250"/></td></tr></table>

### POSTMAN to the Rescue! Yaaayy!!!

Mr Alamu would create a mock API request with POSTMAN, but just before he does that he would want to understand the API Structure.

## API Structure

The AuthServer API endpoint is in the form `<base-url>/api/<api-version>/<route-endpoint>`.

The API is hosted on Google Cloud Compute Engine and the `<base-url>` of the API is `[https://auth-server-242103.appspot.com](https://auth-server-242103.appspot.com)`

All request made to the AuthServer API are made to this base-url.

The API always responds with a conpulsory success property, this property should always be checked for because it tells us if an error occurred while processing the request. The success property is a booloean value that returns `true` when everyhing goes fine and `false` when something goes wrong. The `success: true` response is in the following format.

```javascript
{
    "success": true,
    "payload": {
        "data": [
            {
                "name": "Alamu Obo Langido",
                "email": "langido@gmail.com",
                "number": "09041941941",
                "_id": "5ceeb9a5ffca9f20d630966d",
                "created": "2019-05-29T16:56:05.339Z",
                "__v": 0
            },
            {
                ...
                ...
                ...
            },
        ]
    }
}
```

Consumers of the API should always make sure they check that a `true` success value was returned from the server, if false, handle the error appropriately.

## Error Handling
When an error occurs, the API responds with a `success: false` and an error Object. The error Object contains the error code, error type, error message and additional information about the error in the `err` property.
The server responds to error in the format below.

```javascript
{
    "success": false,
    "error": {
        "code": status,
        "type",
        "message",
        "err"
    }
}
```

* code - Refers to the error code of the error message returned i.e 400, 405, 500, 200 etc

* type - Give the type of error message returned. There are four types of error messages on this server, namely;

    * accountCreationError - Occurs when an error occurs while trying to create an account, either due to an already registered mail being inputted or other releveant reasons
    
    * loginValidationError - Occurs when a user inputs a wrong `email` or `password` during login
    
    * authenticationError - Occurs when a user that has not been authenticated(Not logged in) tries to acces a protected route
    
    * passwordValidationError - Occurs when an unsecure password format is inputted during account creation
* message - A short description of what caused the error

* err - additional information about th error [optional]

## API REQUESTS

`
Good! Now that Mr Alamu understands the API structure, he can create mock requests to the API
`

Mr Alamu would like to create an account on our platform first, our account creation endpoint is https://auth-server-242103.appspot.com/api/v1/signup.

In post man, Mr Alamu sends a `POST` request to the enpoint, the POST request Mr Alamu sent included his details in the request body (name, email, number, password) 

```javascript
{
    "name": "Alamu Obo",
    "email": "langido@gmail.com",
    "number": "09041941941",
    "password": "Alamu_4_Langido"
}
```

Mr Alamu, got a lovely looking JSON response as shown below.

![JSON](https://firebasestorage.googleapis.com/v0/b/ai6-portfolio-abeokuta.appspot.com/o/signup.png?alt=media&token=c19e6945-1be8-443c-a985-1364ec49e0fb)


So, Mr Alamu revisited our application some other day and wanted to login to his account. 

Mr Alamu then sends another `POST` request, to the endpoint https://auth-server-242103.appspot.com/api/v1/login , with the request body containing his email and password. The server responds with a similar nice looking JSOn response has before but this time around with a different token. Internally, this token is stored in a Redis db and is used. **This token should along with the generated id should somewhere for later use**.

Days after, Mr Alamu remembers something very important. He forgot to add his third name while registering!

Good!, we've got Mr Alamu covered!!..

To update his info, Mr Alamu the sends a `PUT` request to the endpoint https://auth-server-242103.appspot.com/api/v1/users/update/<previously-saved-id-returned-from-login> 

Since Mr Alamu must be logged in to be able to update his details, he has to send some form of vlogin verification so the server can know he is logged in (token). In the request header, Mr Alamu adds an `Authorization` header with a value of "Bearer <token>" (The token here should be replaced with the token received after a successful login) as shown below.
    
![token](https://firebasestorage.googleapis.com/v0/b/ai6-portfolio-abeokuta.appspot.com/o/token.png?alt=media&token=67638c10-33fe-4d69-bdbb-02e03e8fbba5)

Now, in the request's body, Mr Alamu specifies the changes he wants made to his account 

```javascript
{
    "name": "Alamu Obo Langido"
}
```

Mr Alamu again got a pretty looking `JSON` response with a message "User information was successfully updated" as shown;

![dataUpdate](https://firebasestorage.googleapis.com/v0/b/ai6-portfolio-abeokuta.appspot.com/o/dataUpdate.png?alt=media&token=f9e8eb8b-ccde-460a-bbc2-9cd2bacaadf4)

### **NB:** GET request's should only be tested in the browser and not on POSTMAN, if you want to test on POSTMAN, make sure you delete the request body before sending the request. Request's body on `GET` requests are not supported on `GCP` 

Mr Alamu is curious and would love to know what kind of customers we have, he is still not satisfied, he wants to be able to view all other users of the platform so he can interact with them. since we have provided an endpoint to view all users. Mr Alamu heads straight to the browser to type in our endpoint so he can see a list of users already registered with us. Mr Alamu types in the endpoint https://auth-server-242103.appspot.com/api/v1/users/

Mr alamu gets the following response back
 ![users](https://firebasestorage.googleapis.com/v0/b/ai6-portfolio-abeokuta.appspot.com/o/users.png?alt=media&token=1c58cb10-8252-4c25-b5ce-2e967efe7c67)
 
 
Mr Alamu being an hard person to please still wants more, he wants to be able to query each user with their respective ID's. We being ready to always please our customer, we provided him with this endpoint to do that 
https://auth-server-242103.appspot.com/api/v1/users/<id>..
    
Mr Alamu copies a users ID from the list of users he got and pasted the URL in a browser. He once again got the following response.

![specific_user](https://firebasestorage.googleapis.com/v0/b/ai6-portfolio-abeokuta.appspot.com/o/specificUser.png?alt=media&token=f1ddc623-b138-44f0-8e28-077e3632468c)

So this is getting fraustrating, Mr Alamu freaking craves for more!!! What exactly does he want gaaan?

![tired](https://media.giphy.com/media/RBeddeaQ5Xo0E/giphy.gif)

He wants to be able to delete his account when we fuck things up, he wants to be able to stop being a customer on our platform at will whenever he desires. We don't want his wahala so we built him yet another APi endpoint https://auth-server-242103.appspot.com/api/v1/users/delete/<id> 
    
Mr Alamu sends a DELETE request to the endpoint after substituting his `ID` for the `id` in the URL and setting Request headers with the appropriate tokens. 

We did it again, we provided him with a nice JSON response as shown below

![deleted](https://firebasestorage.googleapis.com/v0/b/ai6-portfolio-abeokuta.appspot.com/o/delete.png?alt=media&token=ea829937-ef21-4284-bf0f-684f37b798ae)

Mr Alamu being a doubting thomas, went back to the url https://auth-server-242103.appspot.com/api/v1/users/ in his `browser` to confirm that his details is no more there and lo and behold it wasn't there!!

# Finally, Mr Alamu Obo Langido is pleased!!!!  We are happy at AuthServer!!!

![celebration](https://media.giphy.com/media/3o7abIileRivlGr8Nq/giphy.gif)



                                                        ...
