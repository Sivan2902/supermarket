let purchasesLogic = require("../Logic/purchases-logic");
const express = require("express");
const router = express.Router();


// get user last purchase
router.post("/last_purchase", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let cartId = request.body.cartId;
    
    try {
  
        let userLastPurchase = await purchasesLogic.getLastPurchase(token,cartId);
        response.json(userLastPurchase);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });


  //get number of purchases
  router.get("/num_of_purchases",async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    
    try {
  
        let numberOfPurchases = await purchasesLogic.getNumberOfPurchases(token);
        response.json(numberOfPurchases);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });


  //insert new purchase 
  router.post("/", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let newPurchase = request.body;
    
    try {
  
        let userNewPurchase = await purchasesLogic.setNewPurchase(token,newPurchase);
        response.json(userNewPurchase);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });

  router.post("/purchases_dates", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let currentPurchaseDate = request.body;
    currentPurchaseDate = currentPurchaseDate.date;
    
    try {
  
        let occupiedDates = await purchasesLogic.getPurchasesDates(token,currentPurchaseDate);
        response.json(occupiedDates);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });


  

module.exports = router;
