let cartItemsDao = require("../Dao/cart_items-dao")
let cacheModule = require("../Dao/cache-module")
let ErrorType = require("../Errors/error-type");
let ServerError = require("../Errors/server-error");


//get user cart details
async function getCartDetails(cartId,userToken) {

    let isUserValid = cacheModule.get(userToken);

    if(!isUserValid) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let cartDetails = await cartItemsDao.getCartDetails(cartId);
    return cartDetails;
    
}


async function addProductToCart(userToken,cartProduct) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    //validation of input is needed here...
    let insertResponse = await cartItemsDao.addProductToCart(cartProduct);
    return insertResponse;

}

async function updateCartProductAmount(userToken,product) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let updateResponse = await cartItemsDao.updateCartProductAmount(product);
    return updateResponse;

}

async function deleteCartItem(userToken,cartItemId) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let deleteResponse = await cartItemsDao.deleteCartItem(cartItemId);
    return deleteResponse;

}


module.exports = {
    getCartDetails,
    addProductToCart,
    updateCartProductAmount,
    deleteCartItem,
}