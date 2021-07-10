import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/productsService';
import { ProductsDetails } from 'src/models/ProductsDetails';
import { shoppingCartService } from 'src/app/services/shoppingCartService'
import { cartDetails } from 'src/models/cartDetails';
import { receiptDetails } from 'src/models/receiptDetails'
import { MatDialog } from '@angular/material/dialog';
import { FirstBuyDialogComponent } from '../first-buy-dialog/first-buy-dialog.component';
import { cartItems } from 'src/models/cartItems';
import { ContinueShoppingDialogComponent } from '../continue-shopping-dialog/continue-shopping-dialog.component';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component'
import { CartItemsService } from 'src/app/services/cartItemsService';
import { PurchaseService } from 'src/app/services/purchasesService';
import { LastPurchaseDialogComponent } from '../last-purchase-dialog/last-purchase-dialog.component';
import { ProductPopUpDialogComponent } from '../product-pop-up-dialog/product-pop-up-dialog.component';
import { ClosePurchaseDialogComponent } from '../close-purchase-dialog/close-purchase-dialog.component';
import { UserService } from 'src/app/services/userService';
import { Router } from '@angular/router';
import { DeleteCartComponent } from '../delete-cart/delete-cart.component';
import { ErrorHandlerComponent } from '../error-handler/error-handler.component';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  public productsDetails: ProductsDetails[];
  public shoppingCart : cartDetails;
  public cartItems : cartItems[];
  public totalCartPrice : number;
  public overallPrice : number;
  public showCategory : boolean;
  public categories;
  public searchWord : string;
  public showSearch : boolean;
  public availableProductsNumber : number;
  public numberOfPurchases : number;
  public hostUrl : string;

  constructor(private productsService: ProductsService,
              private shoppingCartService : shoppingCartService,
              public cartItemsService : CartItemsService,
              private purchasesService : PurchaseService,
              public userService : UserService,
              public router : Router,
              public dialog : MatDialog) {}

  ngOnInit(): void {

    this.productsDetails = [];
    this.shoppingCart = new cartDetails;
    this.cartItems = [];
    this.cartItemsService.cartProducts = new cartItems;
    this.overallPrice = 0;
    this.categories = [];
    this.searchWord = '';
    this.showSearch = false;
    this.totalCartPrice= 0;
    this.hostUrl = "http://34.65.6.110:3001/";


   
    this.getAllProducts();
    this.getNumberOfPurchases();
    let shoppingCartsObservable = this.shoppingCartService.getUserCart();

        // The method subscribe() issues an http request to the server
        // successfulServerRequestData
        shoppingCartsObservable.subscribe(successfulServerRequestData => {

            this.shoppingCart = successfulServerRequestData;
            if(this.shoppingCart.cartStatus == "First Purchase") {
              this.dialog.open(FirstBuyDialogComponent);
              setTimeout(()=>{this.dialog.closeAll()},3000);
              // empty cart
              this.cartItems = [];

            } 
            else if(this.shoppingCart.cartStatus == "Opened Cart") { //open cart from last visit

              this.getCartDetails();
              
            }
            else { // all carts are closed get last purchase and a new cart
              
                  this.getLastPurchase();
                  this.createNewCart();
            }
            
         

           
        }, serverErrorResponse => {
          
          this.userService.errorMessageToUser = serverErrorResponse.error.error;
          let dialogRef = this.dialog.open(ErrorHandlerComponent);
          dialogRef.afterClosed().subscribe(()=> {
    
              this.userService.errorMessageToUser='';
          });               
        }); 
    
  }

  public getUserName() {
    
    let userName = localStorage.getItem('userName');
    return userName;
  }

   public getAllProducts()  {

    let productsObservable = this.productsService.getAllProducts();

    // The method subscribe() ussues an http request to the server
    // successfulServerRequestData
    productsObservable.subscribe(successfulServerRequestData => {
       
        this.productsDetails = successfulServerRequestData;
        this.availableProductsNumber = this.productsDetails.length;
        this.modifyProductsArray(this.productsDetails);
        
    }, serverErrorResponse => { 
      
        this.userService.errorMessageToUser = serverErrorResponse.error.error;
        let dialogRef = this.dialog.open(ErrorHandlerComponent);
        dialogRef.afterClosed().subscribe(()=> {

            this.userService.errorMessageToUser='';
        });              
    }); 

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

  public createNewCart() {

    let newCartObservable = this.shoppingCartService.createNewCart();
    newCartObservable.subscribe(successfulServerRequestData => {

      this.shoppingCart = successfulServerRequestData;
      // cartItems should be empty
      this.cartItems = [];

      }, serverErrorResponse => {
        
        this.userService.errorMessageToUser = serverErrorResponse.error.error;
        let dialogRef = this.dialog.open(ErrorHandlerComponent);
        dialogRef.afterClosed().subscribe(()=> {
  
            this.userService.errorMessageToUser='';
        });   
      }); 
   }


   public getCartDetails() {

    let cartItemsObservable = this.cartItemsService.getCartDetails(this.shoppingCart.cartId);
    cartItemsObservable.subscribe(successfulServerRequestData => {
      
      this.cartItems = successfulServerRequestData;
      if(this.cartItems.length > 0) {
        //modal which offer the user to go on with unfinished purchase
        //or to start a new one
        for(let i = 0;i < this.cartItems.length;i++){

          this.cartItems[i].totalPrice = this.cartItems[i].price * this.cartItems[i].amount;
          this.totalCartPrice += this.cartItems[i].totalPrice;
          this.cartItems[i].price = +this.cartItems[i].price.toFixed(2);
          this.cartItems[i].totalPrice = +this.cartItems[i].totalPrice.toFixed(2);
          this.overallPrice += this.cartItems[i].totalPrice;
          this.cartItems[i].productImage = this.hostUrl + this.cartItems[i].productImage;
        }
        //update cart service for modal component use.
    
      
        let tempDate = new Date(this.cartItems[0].cartCreationDate);
        this.cartItemsService.cartCreationDate = tempDate.toLocaleDateString();
        this.cartItemsService.cartTotalPrice= this.totalCartPrice.toFixed(2);
      
        // get modal
        let dialogRef = this.dialog.open(ContinueShoppingDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
           result = this.cartItemsService.continueShoppingDialogInput;
           if(result == "Continue Shopping") {
              
              return;
           }
           else {
             
             this.closeCart();
             this.createNewCart();
          }
        });
  
    }
    
    }, serverErrorResponse => {
      
      this.userService.errorMessageToUser = serverErrorResponse.error.error;
      let dialogRef = this.dialog.open(ErrorHandlerComponent);
      dialogRef.afterClosed().subscribe(()=> {

          this.userService.errorMessageToUser='';
      });        
    }); 

  }

   public closeCart() {

    let closeCartObservable = this.shoppingCartService.closeCart(this.shoppingCart.cartId);
    closeCartObservable.subscribe(() => {
      
        this.cartItems = [];
        this.totalCartPrice = 0;
       
    }, serverErrorResponse => {
      
      this.userService.errorMessageToUser = serverErrorResponse.error.error;
      let dialogRef = this.dialog.open(ErrorHandlerComponent);
      dialogRef.afterClosed().subscribe(()=> {

          this.userService.errorMessageToUser='';
      });   
    }); 

  }


  public getLastPurchase() {

    let lastPurchaseObservable = this.purchasesService.getLastPurchase(this.shoppingCart.cartId);
    lastPurchaseObservable.subscribe(successfulServerRequestData => {
  
        let purchaseDetails = successfulServerRequestData;
        if(!purchaseDetails.cartId) { // no purchase history
          return;
        }                 
        else {
          let tempDate = new Date(purchaseDetails.purchaseDate);
          this.purchasesService.purchaseDate = tempDate.toLocaleDateString();
          this.purchasesService.totalPrice = purchaseDetails.totalPrice;
          this.dialog.open(LastPurchaseDialogComponent);
          setTimeout(()=>{this.dialog.closeAll()},5000);
        }

    }, serverErrorResponse => {
      
        this.userService.errorMessageToUser = serverErrorResponse.error.error;
        let dialogRef = this.dialog.open(ErrorHandlerComponent);
        dialogRef.afterClosed().subscribe(()=> {

            this.userService.errorMessageToUser='';
      });   
    }); 
   }


   public getProductModal(product) {

    this.cartItemsService.cartProducts.productId = product.productId;
    this.cartItemsService.cartProducts.productName = product.productName;
    this.cartItemsService.cartProducts.price = product.productPrice;
    this.cartItemsService.cartProducts.productCategory = product.productCategory;
    this.cartItemsService.cartProducts.productImage = product.productImage;
    this.cartItemsService.cartProducts.unitPrice = product.unitPrice;
    this.cartItemsService.cartProducts.kiloPrice = product.kiloPrice;
    this.cartItemsService.cartProducts.hundredGramPrice = product.hundredGramPrice;
    this.cartItemsService.cartProducts.cartId = this.shoppingCart.cartId;
    this.cartItemsService.cartProducts.cartCreationDate = this.shoppingCart.creationDate;

    let dialogRef = this.dialog.open(ProductPopUpDialogComponent);

    dialogRef.afterClosed().subscribe(() => {
      
      if(this.cartItemsService.cartProducts.amount) {

        let price = this.cartItemsService.cartProducts.price;
        let amount = this.cartItemsService.cartProducts.amount;
        this.cartItemsService.cartProducts.totalPrice = price * amount;
        this.productInsertionProcess(product);
      }
    });

  }


   public productInsertionProcess(product) {

    if(this.cartItems.length == 0) { // cart is empty-->insert product
  
      this.insertProductToCart();

  }
  else { // cart isn't empty

      let oldAmount;
      let addedAmount;
      let newAmount;
      let isProductExists = false;
      let oldTotalPrice = 0;

      for(let i = 0; i < this.cartItems.length; i++) {

          if(this.cartItems[i].productId == product.productId) {

              oldAmount = this.cartItems[i].amount;
              oldTotalPrice = oldAmount * product.productPrice;
              addedAmount = this.cartItemsService.cartProducts.amount;
              newAmount = oldAmount + addedAmount;
              isProductExists = true;
          }
      }
      
      if(isProductExists) {

        let newTotalPrice = product.productPrice * newAmount;
        let updateProductAmount = {

          productId : product.productId,
          shoppingCartID : this.shoppingCart.cartId,
          amount : newAmount,
          totalPrice : newTotalPrice.toFixed(2),
        }

        this.updateCartProductAmount(updateProductAmount,oldTotalPrice);
      }
      else { // product doesn't exist in cart

          this.insertProductToCart();

      }
  }

 }

 public deleteCart() {

    let dialogRef = this.dialog.open(DeleteCartComponent);
    dialogRef.afterClosed().subscribe(() => {

      if(this.shoppingCartService.isCartDeletionConfirmed) {

        this.shoppingCartService.isCartDeletionConfirmed = false;
        this.closeCart();
      }
      
    });
    
   }

   public deleteCartItem(cartItem) {

      let cartIdToDelete : number;
      
      for(let i=0; i < this.cartItems.length; i++){

        if(this.cartItems[i].productId == cartItem.productId) {

          cartIdToDelete = this.cartItems[i].cartId;
          break;

        }
      }

      let deleteProductObservable = this.cartItemsService.deleteCartItem(cartIdToDelete);
      deleteProductObservable.subscribe(() => {
        
        for(let i = 0; i < this.cartItems.length; i++) {
          
          if(this.cartItems[i].cartId == cartIdToDelete) {

            this.totalCartPrice -= this.cartItems[i].totalPrice;
            this.cartItems.splice(i,1);
            break;
          }
        }
                              
        
         
      }, serverErrorResponse => { 
        
        this.userService.errorMessageToUser = serverErrorResponse.error.error;
        let dialogRef = this.dialog.open(ErrorHandlerComponent);
        dialogRef.afterClosed().subscribe(()=> {
  
            this.userService.errorMessageToUser='';
        });   
      }); 
   }
  
   public insertProductToCart() {

      let cartProduct = {
        
        productId : this.cartItemsService.cartProducts.productId,
        price : this.cartItemsService.cartProducts.price,
        amount : this.cartItemsService.cartProducts.amount,
        totalPrice : this.cartItemsService.cartProducts.totalPrice,
        shoppingCartID : this.cartItemsService.cartProducts.cartId, 
 
      }

      let insertProductObservable = this.cartItemsService.insertProductToCart(cartProduct);
      insertProductObservable.subscribe(()=> {

        this.totalCartPrice +=this.cartItemsService.cartProducts.totalPrice;
        this.totalCartPrice = +this.totalCartPrice.toFixed(2);   
        this.cartItems.push(this.cartItemsService.cartProducts);
        this.cartItemsService.cartProducts = new cartItems;

      }, serverErrorResponse => {
        
        this.userService.errorMessageToUser = serverErrorResponse.error.error;
        let dialogRef = this.dialog.open(ErrorHandlerComponent);
        dialogRef.afterClosed().subscribe(()=> {
  
            this.userService.errorMessageToUser='';
        });   
    }); 


   }


   public updateCartProductAmount(updatedProduct,oldTotalPrice) {

    let updateProductObservable = this.cartItemsService.updateCartProductAmount(updatedProduct);
    updateProductObservable.subscribe(() => {

      for(let i=0; i < this.cartItems.length; i++) {

        if(this.cartItems[i].productId == updatedProduct.productId) {
          
            this.cartItems[i].amount = updatedProduct.amount;
            this.cartItems[i].totalPrice = updatedProduct.totalPrice;
            this.totalCartPrice += updatedProduct.totalPrice - oldTotalPrice;
            this.totalCartPrice= +this.totalCartPrice.toFixed(2);
        }
      }

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


  public setCategory(category):void {

    this.categories.push(category);

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

  public setReceipt() {

    let receipt : receiptDetails[] = [];
    let item : receiptDetails = new receiptDetails;

    for( let i = 0; i < this.cartItems.length; i++) {

        item.productName = this.cartItems[i].productName;
        item.productImage = this.cartItems[i].productImage;
        item.totalPrice = this.cartItems[i].totalPrice;
        item.amount = this.cartItems[i].amount;
        receipt.push(item);
        item = new receiptDetails;
    }
    this.purchasesService.receipt = receipt;
    this.purchasesService.totalReceiptCost = this.totalCartPrice.toFixed(2);
    
    let dialogRef = this.dialog.open(PurchaseDialogComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.checkForOrder();
      
    });
    
  }
  
  public getCategoryView(categoryName) {

    let category = document.getElementById(categoryName);
    category.scrollIntoView();
  }

  public checkForOrder() {

    if(this.purchasesService.isOrderConfirmed) {

      this.purchasesService.newPurchase.cartId = this.shoppingCart.cartId;
      
      let purchaseObservable = this.purchasesService.setNewPurchase(this.purchasesService.newPurchase);
      purchaseObservable.subscribe(() => {
        
        let dialogRef = this.dialog.open(ClosePurchaseDialogComponent);

        dialogRef.afterClosed().subscribe(()=> {
          
          this.closeCart();
          this.getNumberOfPurchases();
      
        });

      }, serverErrorResponse => { 
        
        this.userService.errorMessageToUser = serverErrorResponse.error.error;
        let dialogRef = this.dialog.open(ErrorHandlerComponent);
        dialogRef.afterClosed().subscribe(()=> {
  
            this.userService.errorMessageToUser='';
        });   
    }); 

    }

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
              this.setCategory(category.currentCategory);
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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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
            this.setCategory(category.currentCategory);

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


