let shoppingCartsDao = require("../Dao/shopping_carts-dao")
let cacheModule = require("../Dao/cache-module")
let ErrorType = require("../Errors/error-type");
let ServerError = require("../Errors/server-error");

//get user cart
async function getUserCart(userToken) {

  let userId = cacheModule.get(userToken);

  if(!userId) { // if the user isn't registered in cache--> throw an error
                // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

  }
  
  // check if there is an open cart
  let response = await shoppingCartsDao.checkForExistingCart(userId);

  let currentDate = new Date();
  const openCart = 1; //meaning truthfull value
    
  if(response == undefined) { // no existing cart-->create a new one
    
    let newCartId = await shoppingCartsDao.setNewCart(userId,currentDate,openCart); 
    let userCart = {
            cartId : newCartId,
            creationDate : currentDate,
            cartStatus : "First Purchase",
    }
    
    return userCart;
  }
  else {//check if there's an open cart 

    if(response.isOpen) { 
            
        let userCart = {
                cartId : response.cartId,
                creationDate : response.creationDate,
                cartStatus : "Opened Cart",
        }
        
        return userCart;
    }
    else { // there's purchase history-  but all carts are closed.
               
        let userCart = {

                cartId : response.cartId,
                creationDate : response.creationDate,
                cartStatus : "All carts closed",
        }
  
        return userCart;
    }
  }

}

async function createNewCart(userToken) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                 // protects hacking through "Postman" request if it got the token from client
         throw new ServerError(ErrorType.ACCESS_DENIED);

    }
    const openCart = 1; // 
    let currentDate = new Date();
    let newCartId = await shoppingCartsDao.setNewCart(userId,currentDate,openCart);
    let newCart = {
        cartId : newCartId,
        creationDate : currentDate,
        isOpen : openCart,
    }

    return newCart;
 }


async function closeCart(cartId,userToken) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                 // protects hacking through "Postman" request if it got the token from client
         throw new ServerError(ErrorType.ACCESS_DENIED);

    }
    const closeCart = 0; // 
    let closedCart = await shoppingCartsDao.closeCart(cartId,closeCart);
    return closedCart;

}


module.exports = {
    getUserCart,
    createNewCart,
    closeCart,
}