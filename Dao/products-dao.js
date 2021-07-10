let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");


//get all products
async function getAllProducts() {
  
  let sql = `SELECT p.product_id as "productId",p.product_name as "productName",
             round(p.price,2) as "productPrice",p.product_image as "productImage",p.price_for_a_kilo as "kiloPrice",
             p.price_for_unit as "unitPrice",p.price_for_100g as "hundredGramsPrice",c.category_name as "productCategory" 
             FROM products p left join categories c on p.category_id = c.category_id;`
  
  try {

      let productsData = await connection.executeWithNoParam(sql);
      return productsData;
  
  } catch (e) {

      console.error(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql,e)
  }
  
}

async function editProduct(product) {

  let sql = `UPDATE products SET
                product_name = ?,
                category_id = 
                  (SELECT category_id FROM categories WHERE category_name = ?),
                price = ? ,
                product_image = ? ,
                price_for_a_kilo = ? ,
                price_for_unit = ?,
                price_for_100g = ?
                WHERE product_id = ?;`;
  let parameters = [product.productName,
                    product.productCategory,
                    product.productPrice,
                    product.productImage,
                    product.kiloPrice,
                    product.unitPrice,
                    product.hundredGramsPrice,
                    product.productId];

  try {

    await connection.executeWithParameters(sql, parameters);    
    return true;

  } catch (e) {

    console.error(e);
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
  
}


async function addProduct(product) {

  let sql = `INSERT INTO products 
            (product_name,
             category_id,
             price,
             product_image,
             price_for_a_kilo,
             price_for_unit,
             price_for_100g)
             VALUES ( ?, (SELECT category_id FROM categories WHERE category_name = ?) , ?, ?, ?, ? , ?);`;
  let parameters = [product.productName,
                    product.productCategory,
                    product.productPrice,
                    product.productImage,
                    product.kiloPrice,
                    product.unitPrice,
                    product.hundredGramsPrice];

  try {

    let additionResult = await connection.executeWithParameters(sql, parameters);    
    return additionResult.insertId;

  } catch (e) {

    console.error(e);
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
  
}


module.exports = {

  getAllProducts,
  editProduct,
  addProduct,
};
