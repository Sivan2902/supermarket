let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");


async function getLastPurchase(userId,cartId) {
  
  let sql = `SELECT cart_ID as "cartId",total_price as "totalPrice",
             purchase_date as "purchaseDate" FROM purchases
             WHERE client_ID = ? and cart_ID = ?;`;
  
  let parameters = [userId,cartId];
  
  try {

      let lastPurchase =  await connection.executeWithParameters(sql,parameters);
      return lastPurchase[0];
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e);
  }
  
}

async function setNewPurchase(purchase) {

  let sql = `INSERT INTO purchases 
            (client_ID, cart_ID, total_price, destination_city,
              destination_street, delivery_date, purchase_date,
              payment_digits) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

  let parameters = [purchase.clientId, purchase.cartId,
                    purchase.totalPrice, purchase.destinationCity,
                    purchase.destinationStreet, purchase.deliveryDate,
                    purchase.purchaseDate, purchase.paymentCard];
  
  try {

      let newPurchase =  await connection.executeWithParameters(sql,parameters);
      return newPurchase.insertId;
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e);
  }
  
}

async function getPurchasesDates(purchaseDate) {

  let sql = `SELECT delivery_date as "date" FROM purchases WHERE delivery_date > ?;`;
  let parameters = [purchaseDate];
  
  try {

      let purchasesDates =  await connection.executeWithParameters(sql,parameters);
      return purchasesDates;
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e);
  }
  
}

async function getNumberOfPurchases() {

  let sql = `SELECT purchase_id as "purchaseId" FROM purchases;`;

  try {

      let numberOfPurchases =  await connection.executeWithNoParam(sql);
      return numberOfPurchases.length;
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e);
  }
  
}


module.exports = {
  getLastPurchase,
  setNewPurchase,
  getPurchasesDates,
  getNumberOfPurchases,
};
