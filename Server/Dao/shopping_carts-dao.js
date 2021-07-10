let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");

async function setNewCart(userId,currentDate,openCart) {

  let sql = `INSERT INTO shopping_carts (client_id, creation_date, is_open) VALUES (?, ?, ?);`;
  let parameters = [userId,currentDate,openCart];
  try {

      let newCartId =  await connection.executeWithParameters(sql,parameters);
      return newCartId.insertId;
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e)
  }
  
}


async function getNewCart(userId,openedCart) {

  
  let sql = `SELECT cart_id as "cartId",creation_date as "creationDate",
             is_open as "isOpen" FROM shopping_carts WHERE client_id = ? and is_open = ?;`
   
  let parameters = [userId, openedCart];
  
  try {

      let newCart = await connection.executeWithParameters(sql,parameters);
      return newCart[0];
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e)
  }
  
}


//check if the user has a cart or it's his first buy
async function checkForExistingCart(userId) {

  let sql = `SELECT client_id as "clientId", cart_id as "cartId",
             is_open as "isOpen",creation_date as "creationDate"
             FROM shopping_carts WHERE client_id = ?
             ORDER BY creation_date DESC;`;
  let parameters = [userId];
  
  try {

      let isCartExist = await connection.executeWithParameters(sql,parameters);
      return isCartExist[0];
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e)
  }
  
}


async function closeCart(cartId,closeCart) {
  
  let sql = `UPDATE shopping_carts SET is_open = ? WHERE cart_id = ?;`;
  let parameters = [closeCart,cartId];
  
  try {

      let closedCart=  await connection.executeWithParameters(sql,parameters);
      return closedCart;
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e)
  }
  
}


async function getOpenCart(userId,openedCart) {

  let sql = `SELECT cart_id as "cartId",creation_date as "creationDate",
             is_open as "isOpen" FROM shopping_carts WHERE client_id = ? and is_open = ?;`
  
  let parameters = [userId,openedCart];
  
  try {

      let openCart = await connection.executeWithParameters(sql,parameters);
      return openCart[0];
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e)
  }
  
}

module.exports = {

  setNewCart,
  getNewCart,
  checkForExistingCart,
  getOpenCart,
  closeCart,
  
};
