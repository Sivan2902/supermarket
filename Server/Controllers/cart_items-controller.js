let cartItemsLogic = require("../Logic/cart_items-logic");
const express = require("express");
const router = express.Router();

//add product to cart
router.post("/", async (request, response, next) => {

  let authorizationString = request.headers["authorization"];
  //Removing the bearer prefix, leaving the clean token
  let token = authorizationString.substring("Bearer ".length);

  let cartProduct = request.body;
  
  try {

      let successfullProductInsertion = await cartItemsLogic.addProductToCart(token,cartProduct);
      response.json(successfullProductInsertion);

    } catch (error) {

        console.log(error);
        return next(error);
    }
});

// get user cart
router.get("/:id", async (request, response,next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let cartId = request.params.id;

    try {
  
        let userCart = await cartItemsLogic.getCartDetails(cartId,token);
        response.json(userCart);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });

  // update cart product amount
  router.put("/update_amount", async (request, response, next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let cartProduct = request.body;
    
    try {
  
        let successfullProductUpdate = await cartItemsLogic.updateCartProductAmount(token,cartProduct);
        response.json(successfullProductUpdate);
  
      } catch (error) {
  
          console.log(error);
          return next(error);
      }
  });


  router.delete("/delete_item/:id", async (request, response, next) => {

    let authorizationString = request.headers["authorization"];
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let cartItemId = request.params.id;
    
    try {
  
        let successfullProductDeletion = await cartItemsLogic.deleteCartItem(token,cartItemId);
        response.json(successfullProductDeletion);
  
      } catch (error) {
  
          console.log(error);
          return next(error);
      }
  });


module.exports = router;
