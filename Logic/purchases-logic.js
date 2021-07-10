let purchasesDao = require("../Dao/purchases-dao")
let cacheModule = require("../Dao/cache-module")
let ErrorType = require("../Errors/error-type");
let ServerError = require("../Errors/server-error");

//get user last purchase
async function getLastPurchase(userToken,cartId) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let userLastPurchase = await purchasesDao.getLastPurchase(userId,cartId);

    if(userLastPurchase == undefined) { //no purchases history

        // insert "null", as no purchase history exists
        let purchaseDetails = null;
        return purchaseDetails;

    }
    else { // there's purchase history

        let purchaseDetails = {
            cartId : userLastPurchase.cartId,
            totalPrice : userLastPurchase.totalPrice,
            destinationCity : null,
            destinationStreet : null,
            deliveryDate : null,
            purchaseDate : userLastPurchase.purchaseDate,
            paymentCard : null,
        }
        return purchaseDetails;
    }
    
 }


 async function setNewPurchase(userToken,newPurchase) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    //validation
    getPurchaseValidation(newPurchase);

    editedPurchase = {
        clientId : userId,
        cartId : newPurchase.cartId,
        deliveryDate : newPurchase.deliveryDate,
        purchaseDate : newPurchase.purchaseDate,
        destinationCity : newPurchase.destinationCity,
        destinationStreet : newPurchase.destinationStreet,
        paymentCard : newPurchase.paymentCard,
        totalPrice : newPurchase.totalPrice,
    }

    let purchaseInsertionResponse = await purchasesDao.setNewPurchase(editedPurchase);
    return purchaseInsertionResponse;
    
 }
 

 async function getPurchasesDates(userToken,purchaseDate) {

    let userId = cacheModule.get(userToken);
    let countDates = [];
    const DATE_OCCUPIED = 3;
    let takenDates = [];
    let currentDate;
    let dataBaseDate;
    let repeatedDate;

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    if(purchaseDate) {
        let purchaseDateCheck = await purchasesDao.getPurchasesDates(purchaseDate);
        if(purchaseDateCheck) {
    
            for (let i = 0; i  < purchaseDateCheck.length; i++) {
                
                if(countDates.length) {
    
                    for(let j = 0; j < countDates.length; j++) {
    
                        dataBaseDate = new Date(purchaseDateCheck[i].date).getTime();
                        repeatedDate = new Date(countDates[j].date).getTime();
                        if(dataBaseDate === repeatedDate) {

                            countDates[j].repeats++;

                            if(countDates[j].repeats >= DATE_OCCUPIED) {

                                if(!takenDates.includes(countDates[j].date)) {
                                    
                                    takenDates.push(purchaseDateCheck[i].date);
                                }
                            }
                            
                        }
                        else {
                            currentDate = {
                                date : purchaseDateCheck[i].date,
                                repeats : 1,
                            }
                            countDates.push(currentDate);
                        }
                    }
                    
                }
                else {
                    currentDate = {
                        date : purchaseDateCheck[i].date,
                        repeats : 1,
                    }
                    countDates.push(currentDate);
                }

            }

            return takenDates;
        }
        else {// no purchases yet

            return [];
        }
    }
    else {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }
 }


 function getPurchaseValidation(purchase) {

    const MAX_STREET_LENGTH = 250;
    const MAX_CITY_LENGTH = 150;
    const MAX_DATE_LENGTH = 100;
    const MAX_CARD_LENGTH = 16;

    if(!purchase.cartId && !isNaN(purchase.cartId)) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    if(!purchase.deliveryDate && purchase.deliveryDate.length <= MAX_DATE_LENGTH) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    if(!purchase.purchaseDate && purchase.purchaseDate.length <= MAX_DATE_LENGTH) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    if(!purchase.destinationCity && purchase.destinationCity.length <= MAX_CITY_LENGTH) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    if(!purchase.destinationStreet && purchase.destinationStreet.length <= MAX_STREET_LENGTH) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    if(!purchase.totalPrice && !isNaN(purchase.totalPrice)) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    let regex;
    let result;

    if(!purchase.paymentCard) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

         
   regex = new RegExp("^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$");
   result = regex.test(purchase.paymentCard);

   if(!result && purchase.paymentCard.length > MAX_CARD_LENGTH) {
           
        throw new ServerError(ErrorType.INVALID_INPUT);
   }

}

async function getNumberOfPurchases(userToken) {

    let userId = cacheModule.get(userToken);

    if(!userId) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let numberOfPurchases = await purchasesDao.getNumberOfPurchases();
    return numberOfPurchases;

}

module.exports = {
    getLastPurchase,
    setNewPurchase,
    getPurchasesDates,
    getNumberOfPurchases,
}