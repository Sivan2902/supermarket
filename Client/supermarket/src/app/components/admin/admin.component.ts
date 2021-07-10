import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService';
import { ProductsDetails } from 'src/models/ProductsDetails';
import { AddProductSuccessComponent } from '../add-product-success/add-product-success.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { AdminSearchedProductComponent } from '../admin-searched-product/admin-searched-product.component';
import { PurchaseService } from 'src/app/services/purchasesService';
import { UserService } from 'src/app/services/userService';
import { Router } from '@angular/router';
import { ErrorHandlerComponent } from '../error-handler/error-handler.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public productsDetails : ProductsDetails[];
  public categories;
  public showSearch : boolean;
  public searchWord : string;
  public editedProduct : any;
  public addedProduct : ProductsDetails;
  public unitOptions : string[];
  public validName : FormControl;
  public productName : string;
  public productImage : string;
  public validCategory : FormControl;
  public productCategory : string;
  public validPrice : FormControl;
  public price : string;
  public validPriceUnit : FormControl;
  public priceUnit : string;
  public adminEditForm : FormGroup;
  public showEditSection : boolean;
  public showNoContent : boolean;
  public showUploadPanel : boolean;
  public disableImageLoading : boolean;
  public imageToUpload;
  //host URL
  public hostUrl : string; 
  public numberOfPurchases :number;
  public availableProductsNumber : number;


  constructor(public productsService : ProductsService,
              public purchasesService : PurchaseService,
              public userService : UserService,
              public router : Router,
              public dialog : MatDialog) { }

  ngOnInit(): void {
    
    this.getAllProducts();
    this.getNumberOfPurchases();
    this.categories = [];
    this.searchWord = '';
    this.showSearch = false;
    this.productsDetails = [];
    this.price = '';
    this.productCategory = '';
    this.priceUnit = '';
    this.productName = '';
    this.unitOptions = ["Price for Kilo","Price for Unit","Price for 100g"];
    this.showEditSection = false;
    this.showNoContent = true;
    this.showUploadPanel = false;
    this.disableImageLoading = true;
    this.hostUrl = "http://34.65.6.110:3001/";

    this.validName = new FormControl('',[Validators.required]);
    this.validCategory = new FormControl('', [Validators.required]);
    this.validPrice = new FormControl('', [Validators.required]);
    this.validPriceUnit = new FormControl('', [Validators.required]);
  
    this.adminEditForm = new FormGroup ({
      productName : this.validName,
      productCategory : this.validCategory,
      productPrice : this.validPrice,
      prouductUnit: this.validPriceUnit,
    });
  
  }


  public getAllProducts()  {

    let productsObservable = this.productsService.getAllProducts();

    // The method subscribe() ussues an http request to the server
    // successfulServerRequestData
    productsObservable.subscribe(successfulServerRequestData => {
        
        this.productsDetails = successfulServerRequestData;
        this.availableProductsNumber = this.productsDetails.length;
        this.modifyProductsArray(this.productsDetails);
        this.getCategories();
      
    }, serverErrorResponse => {
      
      this.userService.errorMessageToUser = serverErrorResponse.error.error;
      let dialogRef = this.dialog.open(ErrorHandlerComponent);
      dialogRef.afterClosed().subscribe(()=> {

          this.userService.errorMessageToUser='';
      });             
    }); 

  }


  public modifyProductsArray(products)  {

   
    for(let i=0; i < products.length; i++) {

        products[i].productPrice = products[i].productPrice.toFixed(2);
        products[i].productImage = this.hostUrl + products[i].productImage;
        
    }

    this.sortProductsByCategory();
  }


  public getCategoryView(categoryName) {

    let category = document.getElementById(categoryName);
    category.scrollIntoView();
  }


  public clearEditFields() {

    this.editedProduct = new ProductsDetails;
    this.productName = '';
    this.productCategory = '';
    this.price = '';
    this.productImage = '';
    this.priceUnit = '';
    this.imageToUpload = '';
    this.showEditSection = false;
    this.showNoContent = true;
    this.showUploadPanel = false;
    this.disableImageLoading = true; 
  }

  public getNumberOfPurchases() {

    let Observable = this.purchasesService.getNumberOfPurchases();
    Observable.subscribe(successfulServerRequestData => {
        
        this.numberOfPurchases = successfulServerRequestData;
       
    }, serverErrorResponse => { 
      
      this.userService.errorMessageToUser = serverErrorResponse.error.error;
      let dialogRef = this.dialog.open(ErrorHandlerComponent);
      dialogRef.afterClosed().subscribe(()=> {

          this.userService.errorMessageToUser='';
      });   
    }); 

  }

  public sortProductsByCategory() {

    let pastries = [];
    let meatChickenAndFish = [];
    let dairyProducts = [];
    let vegetablesAndFruits = [];
    let cookingBakingAndCanned = [];
    let beverages = [];
    let sweets = [];
    let pharm = [];
    let organic = [];
    let cleaningProducts = [];
    let sortedProducts = [];

    this.productsDetails.forEach( (product) => {

        if(product.productCategory == "Pastries & Bread") {

            if(pastries.length == 0){

              let category = {
                currentCategory : product.productCategory,
                isNewCategory : true,
              }
              pastries.push(category);
              pastries.push(product);
            }
            else {
              
              pastries.push(product);
        
            }
        }
        if(product.productCategory == "Vegetables & Fruits") {

          if(vegetablesAndFruits.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            vegetablesAndFruits.push(category);
            vegetablesAndFruits.push(product);

          }
          else {
            
            vegetablesAndFruits.push(product);
      
          }
        
        }

        if(product.productCategory == "Dairy products & Eggs") {

          if(dairyProducts.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            dairyProducts.push(category);
            dairyProducts.push(product);
          }
          else {
            
            dairyProducts.push(product);
      
          }
        }

        if(product.productCategory == "Meat,Chicken & Fish") {

          if(meatChickenAndFish.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            meatChickenAndFish.push(category);
            meatChickenAndFish.push(product);
          }
          else {
            
            meatChickenAndFish.push(product);
      
          }
        
        }

        if(product.productCategory == "Cooking,Baking & Canned goods") {
          
          if(cookingBakingAndCanned.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            cookingBakingAndCanned.push(category);
            cookingBakingAndCanned.push(product);
          }
          else {
            
            cookingBakingAndCanned.push(product);
      
          }
        
        }

        if(product.productCategory == "Sweets,Snacks & Cereals") {

          if(sweets.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            sweets.push(category);
            sweets.push(product);
          }
          else {
            
            sweets.push(product);
      
          }
        
        }

        if(product.productCategory == "Pharm") {

          if(pharm.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            pharm.push(category);
            pharm.push(product);
          }
          else {
            
            pharm.push(product);
      
          }
        }

        if(product.productCategory == "Cleaning & Disposables") {

          if(cleaningProducts.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            cleaningProducts.push(category);
            cleaningProducts.push(product);
          }
          else {
            
            cleaningProducts.push(product);
      
          }
        
        }

        if(product.productCategory == "Organic & Health") {

          if(organic.length == 0){

            let category = {
              currentCategory : product.productCategory,
              isNewCategory : true,
            }
            organic.push(category);
            organic.push(product);
          }
          else {
            
            organic.push(product);
      
          }
        }

    });

    sortedProducts = pastries.concat(meatChickenAndFish);
    sortedProducts = sortedProducts.concat(dairyProducts);
    sortedProducts = sortedProducts.concat(vegetablesAndFruits);
    sortedProducts = sortedProducts.concat(cookingBakingAndCanned);
    sortedProducts = sortedProducts.concat(beverages);
    sortedProducts = sortedProducts.concat(sweets);
    sortedProducts = sortedProducts.concat(pharm);
    sortedProducts = sortedProducts.concat(cleaningProducts);
    sortedProducts = sortedProducts.concat(organic);
    this.productsDetails = sortedProducts;

  }


  public getCategories():void {

    let allProducts : any = this.productsDetails;

    for(let i = 0; i< allProducts.length; i++){

      if(allProducts[i].currentCategory) {
        
        this.categories.push(allProducts[i].currentCategory);
      }
    }

  }

  public getUserInput(event : any) {

    let userInput = event.target.value;
    if(userInput == '') {

      this.showSearch = false;
    }
    else {

      this.showSearch = true;
    }

  }


  public editProduct(product) {
    
    this.editedProduct = product;
    this.productName = this.editedProduct.productName;
    this.productImage = this.editedProduct.productImage;
    this.productCategory = this.editedProduct.productCategory;
    this.priceUnit = ' ';
    this.price = this.editedProduct.productPrice;
    this.showNoContent = false;
    this.showEditSection = true;
    
   }

   public sendEditedProduct() {

      this.validateEditedProductFields();

      let productToEdit = {

        productId : this.editedProduct.productId,
        productName : this.productName,
        productCategory : this.productCategory,
        productImage : this.editedProduct.productImage,
        productPrice : this.price,
        kiloPrice : this.editedProduct.kiloPrice,
        unitPrice : this.editedProduct.unitPrice,
        hundredGramsPrice : this.editedProduct.hundredGramsPrice

      }
      
      let editedProductObservable = this.productsService.editProduct(productToEdit);

      editedProductObservable.subscribe(() => {
        
        for(let i = 0; i < this.productsDetails.length; i++) {
        
            if(this.productsDetails[i].productId == productToEdit.productId){
              
               this.productsDetails[i] = productToEdit;
               
            }
        }

        this.sortProductsByCategory();
        this.clearEditFields();
        
        }, serverErrorResponse => { 
          
          this.userService.errorMessageToUser = serverErrorResponse.error.error;
          let dialogRef = this.dialog.open(ErrorHandlerComponent);
          dialogRef.afterClosed().subscribe(()=> {
    
              this.userService.errorMessageToUser='';
          });   
        }); 

  } 

  public validateEditedProductFields() {

    if(!this.productName) {
      
        this.productName = this.editedProduct.productName;
    }

    if(!this.productCategory) {
      
      this.productCategory = this.editedProduct.productCategory;
    }

    if(!this.price) {
      
      this.price = this.editedProduct.productPrice;
    }

    if(this.priceUnit) {
      
      this.getProductUnit();
    }

  }

  public getProductUnit() {

    if(this.priceUnit) {

      if(this.priceUnit == "Price for Kilo") {

        this.editedProduct.kiloPrice = 1;
        this.editedProduct.unitPrice = 0;
        this.editedProduct.hundredGramsPrice = 0;
      }
      else if(this.priceUnit == "Price for Unit") {
        
        this.editedProduct.kiloPrice = 0;
        this.editedProduct.unitPrice = 1;
        this.editedProduct.hundredGramsPrice = 0;
      }
      else {// it's hundred grams price

        this.editedProduct.kiloPrice = 0;
        this.editedProduct.unitPrice = 0;
        this.editedProduct.hundredGramsPrice = 1;
      }
    }
  }

  public getChosenFile(event:any) {
  
    if(event.target.value) {

      this.imageToUpload = <File>event.target.files[0];
      this.disableImageLoading = false;

    }
  }

  public getUploadImagePanel() {

    this.showUploadPanel = true;
  }

  public uploadImage() {

    let data = new FormData();
    let imageFileToDelete = this.editedProduct.productImage;
    imageFileToDelete = imageFileToDelete.substring(this.hostUrl.length ,imageFileToDelete.length);
    
    if(this.imageToUpload) {
      
      if(this.editedProduct.productImage) { // if older image exists

        data.append('fileToDelete',imageFileToDelete);

        let deleteImageObservable = this.productsService.uploadImage(data);

        deleteImageObservable.subscribe(() => {
          
            this.uploadNewImage();
      
        }, serverErrorResponse => {
          
          this.userService.errorMessageToUser = serverErrorResponse.error.error;
          let dialogRef = this.dialog.open(ErrorHandlerComponent);
          dialogRef.afterClosed().subscribe(()=> {
    
              this.userService.errorMessageToUser='';
          });   
        }); 
      }
      
    }
  }

  public uploadNewImage() {

    let data = new FormData();

    data.append('file',this.imageToUpload);
      let imageObservable = this.productsService.uploadImage(data);

        imageObservable.subscribe(successfulServerRequestData => {
        
          let insertedImage = successfulServerRequestData;
          this.editedProduct.productImage = this.hostUrl + insertedImage.filename;
      
        }, serverErrorResponse => { 
          
          this.userService.errorMessageToUser = serverErrorResponse.error.error;
          let dialogRef = this.dialog.open(ErrorHandlerComponent);
          dialogRef.afterClosed().subscribe(()=> {
    
              this.userService.errorMessageToUser='';
          });   
        }); 

  }

  public addProduct() {

    this.productsService.allProducts = this.productsDetails;
    let dialogRef = this.dialog.open(AddProductComponent);
    let addProductSuccess;

        dialogRef.afterClosed().subscribe(()=> {
          
          this.sortProductsByCategory();

          if(this.productsService.isProductAdded) {
          
            addProductSuccess = this.dialog.open(AddProductSuccessComponent);
            addProductSuccess.afterClosed().subscribe(()=> {

              this.productsService.isProductAdded = false;
              this.availableProductsNumber++;
            
            });
          }
      
        });

  }


  public getSearchedProductModal(product) {

      this.showSearch = false;
      this.searchWord = '';
      this.productsService.searchedProduct = product;

      let dialogRef = this.dialog.open(AdminSearchedProductComponent);

      dialogRef.afterClosed().subscribe(()=> {

        if(this.productsService.isEditModeOn) {

            this.productsService.searchedProduct = new ProductsDetails;
            this.productsService.isEditModeOn = false;
            this.editProduct(product);

        }  
            
      });

  }

  public getUserName() {
    
    let userName = localStorage.getItem('userName');
    return userName;
  }

  public logoutUser() {
    
    let logOutObservable = this.userService.logoutUser();
    logOutObservable.subscribe(() => {

        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        this.router.navigate(["/login"]);

      
        }, serverErrorResponse => {
          
          this.userService.errorMessageToUser = serverErrorResponse.error.error;
          let dialogRef = this.dialog.open(ErrorHandlerComponent);
          dialogRef.afterClosed().subscribe(()=> {
    
              this.userService.errorMessageToUser='';
          });   
        }); 
    
  }

}

