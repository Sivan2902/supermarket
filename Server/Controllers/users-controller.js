let usersLogic = require("../logic/users-logic");
const express = require("express");

const router = express.Router();


router.post("/login", async (request, response, next) => {

  // get user details from client's BODY request
  let user = request.body;
  
  
  try {

      let successfullLoginData = await usersLogic.login(user);
      response.json(successfullLoginData);

    } catch (error) {

        console.log(error);
        return next(error);
    }
});

//add user from registration

router.post("/", async (request, response, next) => {
  
  let user = request.body;

  try {
      
      let successfullLoginData = await usersLogic.addUser(user);
      response.json(successfullLoginData);
  }
  catch (error) {

    console.log(error);
    return next(error);
  }
});


router.get("/purchase_details", async (request, response, next) => {
 
  let authorizationString = request.headers["authorization"];
  
  //Removing the bearer prefix, leaving the clean token
  let token = authorizationString.substring("Bearer ".length);

  try {

      let userPurchaseDetails = await usersLogic.getUserPurchaseDetails(token);
      response.json(userPurchaseDetails);

    } catch (error) {

        console.log(error);
        return next(error);
    }
});

// log out the user

router.get("/logout_user", async (request, response, next) => {
  

  let authorizationString = request.headers["authorization"];

  //Removing the bearer prefix, leaving the clean token
  let userToken = authorizationString.substring("Bearer ".length);
  
  try {
  
       usersLogic.deleteUserFromServerCache(userToken);
       response.json();
  }
  catch (error) {
    
    console.log(error);
    return next(error);
  }
});


module.exports = router;
