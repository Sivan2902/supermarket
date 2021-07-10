let productsDao = require("../Dao/products-dao")
let cacheModule = require("../Dao/cache-module")
let ErrorType = require("../Errors/error-type");
let ServerError = require("../Errors/server-error");

//get all products
async function getAllProducts(userToken) {

    let isUserValid = cacheModule.get(userToken);

    if(!isUserValid) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

     let response = await productsDao.getAllProducts();
     return response;

}


async function editProduct(userToken,editedProduct) {

    let isUserValid = cacheModule.get(userToken);

    if(!isUserValid) { // if the user isn't registered in cache--> throw an error
                     // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let isEditMode = true;

    if(validateEditedProductFields(editedProduct, isEditMode)) {
    
        editedProduct = removeImageUrlPrefix(editedProduct);

        let editResult = await productsDao.editProduct(editedProduct);
        return editResult;
        
    }

}

function removeImageUrlPrefix(product) {

    let hostUrl = "http://34.65.6.110:3001/";
    
    if(product) {
        
        if(product.productImage) {

            product.productImage = product.productImage.substring(hostUrl.length,product.productImage.length);
            return product;

        }
    }
}

function validateEditedProductFields(product, isEditMode) {

    const MAX_LENGTH = 25;
    const MIN_LENGTH = 1;
    const CHOSEN_UNIT = 1;
    const UNCHOSEN_UNIT = 0;
    const categories = ["Pastries & Bread","Meat,Chicken & Fish",
                        "Dairy products & Eggs","Vegetables & Fruits",
                        "Cooking,Baking & Canned goods","Pharm",
                        "Sweets,Snacks & Cereals","Cleaning & Disposables",
                        "Organic & Health"];


    if(!product) {

        throw new ServerError(ErrorType.INVALID_INPUT);
    }

    if(isEditMode) {
        
        if(!product.productId || isNaN(product.productId)) {

            throw new ServerError(ErrorType.INVALID_INPUT);

        }
    }

    if(!product.productName || product.productName.length < MIN_LENGTH ||
        product.productName.length > MAX_LENGTH)  {

            throw new ServerError(ErrorType.INVALID_INPUT);

    }

    if(!product.productCategory || !categories.includes(product.productCategory)) {

        throw new ServerError(ErrorType.INVALID_INPUT);

    }

    if(!product.productPrice || product.productPrice < MIN_LENGTH) {

        throw new ServerError(ErrorType.INVALID_INPUT);

    }

    if(product.kiloPrice != CHOSEN_UNIT && product.kiloPrice != UNCHOSEN_UNIT) {

        throw new ServerError(ErrorType.INVALID_INPUT);

    }

    if(product.unitPrice != CHOSEN_UNIT && product.unitPrice != UNCHOSEN_UNIT) {

        throw new ServerError(ErrorType.INVALID_INPUT);

    }

    if(product.hundredGramsPrice != CHOSEN_UNIT && product.hundredGramsPrice != UNCHOSEN_UNIT) {

        throw new ServerError(ErrorType.INVALID_INPUT);

    }
    return true;
}


async function addProduct(userToken,productToAdd){

    let isUserValid = cacheModule.get(userToken);

    if(!isUserValid) { // if the user isn't registered in cache--> throw an error
                       // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

    }

    let isEditMode = false;

    if(validateEditedProductFields(productToAdd, isEditMode)) {

        let addProductResult = await productsDao.addProduct(productToAdd);
        return addProductResult;
    }

}

module.exports = {
    getAllProducts,
    editProduct,
    addProduct,
}