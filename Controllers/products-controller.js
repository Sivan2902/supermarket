let productsLogic = require("../Logic/products-logic");
const express = require("express");
const router = express.Router();
const multer = require('multer');

//npm i fs
const fs = require('fs');

const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");

// for uploading image process

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

let upload = multer({ storage: storage }).single('file');

// host's URL (server side URL)
// let hostUrl = "http://34.65.6.110:3001/";

router.post('/upload_image', function (request, response) {

    upload(request, response, function (error) {
    if (error) {
        console.log(error);
        throw new ServerError(ErrorType.IMAGE_UPLOAD_FAILED,error)
    }
    
    if (request.body.fileToDelete != undefined) {
       
        // delete the existing image file in "uploads"
        deletePicture(request.body.fileToDelete);
    }
    
    //update image file with the new uploaded image
    // request.file.filename = hostUrl + request.file.filename;
    return response.status(200).send(request.file);
    })
});


// this function deletes an image from "uploads" folder,
// due to product image replacement.
function deletePicture(pictureForDelete) {
  fs.unlinkSync("./uploads/" + pictureForDelete);
  console.log("File deleted");
}


// get all products
router.get("/", async (request, response, next) => {

    let authorizationString = request.headers["authorization"];
  
    //Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
  
    try {
  
        let successfulProductsDataResponse = await productsLogic.getAllProducts(token);
        response.json(successfulProductsDataResponse);
              
    } catch (error) {
      
       console.log(error);
       return next(error);
    }
  });



router.put("/edit_product", async (request, response, next) => {
  

  let authorizationString = request.headers["authorization"];

  //Removing the bearer prefix, leaving the clean token
  let userToken = authorizationString.substring("Bearer ".length);
  let editedProduct = request.body;

  try {
  
       let editSucceeded = await productsLogic.editProduct(userToken,editedProduct);
       response.json(editSucceeded);
  }
  catch (error) {
    
    console.log(error);
    return next(error);
  }
});

//add product
router.post("/", async (request, response, next) => {
  

  let authorizationString = request.headers["authorization"];

  //Removing the bearer prefix, leaving the clean token
  let userToken = authorizationString.substring("Bearer ".length);
  let productToAdd = request.body;

  try {
  
       let productAdditionSuccess = await productsLogic.addProduct(userToken,productToAdd);
       response.json(productAdditionSuccess);
  }
  catch (error) {
    
    console.log(error);
    return next(error);
  }
});


module.exports = router;
