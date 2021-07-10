let connection = require("./connection-wrapper");
let ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");


//get cart details
async function getCartDetails(cartId) {

    let sql = `SELECT c.cart_id as "cartId",c.product_id as "productId",
               c.amount,c.total_price as "totalPrice",c.price,c.shopping_cart_id as "shoppingCartId",
               s.creation_date as "cartCreationDate",p.product_name as "productName",
               p.product_image as "productImage",p.price_for_unit as "unitPrice",
               p.price_for_a_kilo as "kiloPrice",p.price_for_100g as "hundredGramPrice"
               FROM cart_items c LEFT JOIN shopping_carts s on c.shopping_cart_id = s.cart_id
               join products p on p.product_id = c.product_id  
               WHERE c.shopping_cart_id = ?`;
    let parameters = [cartId];

    try {

      let cartDetails = await connection.executeWithParameters(sql,parameters);
      return cartDetails;
      
    } catch (e) {

      console.log(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,JSON.stringify(user), e);
      
    }


}



async function addProductToCart(product) {
    
  let sql = `INSERT INTO cart_items
             (product_id, amount, total_price, price, shopping_cart_id)
             VALUES(?, ?, ?, ?, ? );`;
  let parameters = [product.productId,product.amount,
                    product.totalPrice,product.price,
                    product.shoppingCartID];

  try {
    
      let insertResponse = await connection.executeWithParameters(sql, parameters);
      return insertResponse.insertId;

  } catch (e) {

      console.log(error);
      throw new ServerError(ErrorType.GENERAL_ERROR,JSON.stringify(user), e);
  }

}


async function updateCartProductAmount(product) {
    
  let sql = `UPDATE cart_items SET 
             amount = ? , total_price = ? 
             WHERE shopping_cart_id = ? and product_id = ?;`;
  let parameters = [product.amount,product.totalPrice,
                    product.shoppingCartID,product.productId];

  try {
    
      let updateResponse = await connection.executeWithParameters(sql, parameters);
      return updateResponse;

  } catch (e) {

      console.log(error);
      throw new ServerError(ErrorType.GENERAL_ERROR,JSON.stringify(user), e);
  }

}

async function deleteCartItem(cartItemId) {

  let sql = "DELETE FROM cart_items WHERE  cart_id = ?;";
  let parameters = [cartItemId];

  try {
    
      let deleteResponse = await connection.executeWithParameters(sql, parameters);
      return deleteResponse;

  } catch (e) {

      console.log(error);
      throw new ServerError(ErrorType.CART_ITEM_DELETION_FAILED,JSON.stringify(user), e);
  }
}



module.exports = {
  getCartDetails,
  addProductToCart,
  updateCartProductAmount,
  deleteCartItem,
};
