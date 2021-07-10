let shoppingCartsLogic = require("../Logic/shopping_carts-logic");
const express = require("express");
const router = express.Router();


// get user cart
router.get("/", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
  
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
  
    try {
  
        let userCart = await shoppingCartsLogic.getUserCart(token);
        response.json(userCart);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });


  router.get("/new_cart", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
  
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
  
    try {
  
        let userNewCart = await shoppingCartsLogic.createNewCart(token);
        response.json(userNewCart);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });


  router.put("/close_cart", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
  
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    
    let cartId = request.body.id;

    try {
  
        let cartToClose = await shoppingCartsLogic.closeCart(cartId,token);
        response.json(cartToClose);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });



module.exports = router;
