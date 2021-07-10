import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService';
import { UserService } from 'src/app/services/userService';
import { ProductsDetails } from 'src/models/ProductsDetails';
import { ErrorHandlerComponent } from '../error-handler/error-handler.component';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  public adminAddProductForm : FormGroup;
  public productName : string;
  public validName : FormControl;
  public productCategory : string;
  public validCategory : FormControl;
  public productPrice : string;
  public validPrice : FormControl;
  public priceUnit : string;
  public validPriceUnit : FormControl;
  public productImage;
  public uploadedImage;
  public validImage : FormControl;
  public unitOptions : string[];
  public categories : string[];
  public showUploadButton : boolean;
  public kiloPrice : number;
  public unitPrice : number;
  public hundredGramsPrice : number;



  constructor(private productsService : ProductsService,
              private dialogRef: MatDialogRef<AddProductComponent>,
              public dialog : MatDialog,
              public userService : UserService) { 
                
                this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    this.productName = '';
    this.productCategory = '';
    this.productPrice = '';
    this.priceUnit = '';
    this.unitOptions = ["Price for Kilo","Price for Unit","Price for 100g"];
    
    this.categories = ["Pastries & Bread","Meat,Chicken & Fish",
                       "Dairy products & Eggs","Vegetables & Fruits",
                       "Cooking,Baking & Canned goods","Pharm",
                       "Sweets,Snacks & Cereals","Cleaning & Disposables",
                       "Organic & Health"];
    
    this.validName = new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z0-9_ ]{3,25}$/)]);
    this.validCategory = new FormControl('', [Validators.required]);
    this.validPrice = new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);
    this.validPriceUnit = new FormControl('', [Validators.required]);
    this.validImage = new FormControl('', [Validators.required]);
    this.showUploadButton = false;

    this.adminAddProductForm = new FormGroup ({
      productName : this.validName,
      productCategory : this.validCategory,
      productPrice : this.validPrice,
      productUnit: this.validPriceUnit,
      productImage : this.validImage,
    });



  }

  public goBack() {
    this.dialogRef.close(true);
  }

  public getChosenImage(event) {

    if(event.target.value) {

      this.productImage = <File>event.target.files[0];
      this.showUploadButton = true;
    }

  }

  public getProductNameErrorMessage() {
    if (this.validName.hasError('required')) {
      return 'This Field is required';
    }

    return this.validName.hasError('pattern') ? 'Product name should be between 3-25 characters/numbers only' : '';
  }

  public getProductPriceErrorMessage() {
    if (this.validPrice.hasError('required')) {
      return 'This Field is required';
    }

    return this.validPrice.hasError('pattern') ? 'Product price holds numbers only and should be greater than 1' : '';
  }

  public validateProductFields() {

    if(!this.productName) {
      
        return false;
    }

    if(!this.productCategory) {
      
        return false;
    }

    if(!this.productPrice) {
      
      return false;
    }

    if(!this.priceUnit) {
      
      return false;

    }
    if(this.priceUnit) {

      this.getProductUnit();
    }

    return true;

  }

  public getProductUnit() {

    if(this.priceUnit) {

      if(this.priceUnit == "Price for Kilo") {

        this.kiloPrice = 1;
        this.unitPrice = 0;
        this.hundredGramsPrice = 0;
      }
      else if(this.priceUnit == "Price for Unit") {
        
        this.kiloPrice = 0;
        this.unitPrice = 1;
        this.hundredGramsPrice = 0;
      }
      else {// it's hundred grams price

        this.kiloPrice = 0;
        this.unitPrice = 0;
        this.hundredGramsPrice = 1;
      }
    }
  }

  public uploadImage() {

    let data = new FormData();
    
    if(this.productImage) {

      data.append('file',this.productImage);
      let addImageObservable = this.productsService.uploadImage(data);

        addImageObservable.subscribe(successfulServerRequestData => {
          
          this.uploadedImage = successfulServerRequestData;
          this.addProduct();

        }, serverErrorResponse => {
          
          this.userService.errorMessageToUser = serverErrorResponse.error.error;
          let dialogRef = this.dialog.open(ErrorHandlerComponent);
          dialogRef.afterClosed().subscribe(()=> {
    
              this.userService.errorMessageToUser='';
          });   
        }); 
      }


  }
  public addingProductProcess() {
    this.uploadImage();
    
  }
  public addProduct() {

    let productToAdd = new ProductsDetails;
   
    if(this.validateProductFields()) {

      productToAdd.productName = this.productName;
      productToAdd.productCategory = this.productCategory;
      productToAdd.productPrice = this.productPrice;
      productToAdd.hundredGramsPrice = this.hundredGramsPrice;
      productToAdd.kiloPrice = this.kiloPrice;
      productToAdd.unitPrice = this.unitPrice;
      
      if(this.productImage) {
        
        if(this.uploadedImage) {
  
            productToAdd.productImage = this.uploadedImage.filename;
            
        }
        
      }
      
      let addProductObservable = this.productsService.addProduct(productToAdd);

        addProductObservable.subscribe(successfulServerRequestData => {
      
            let insertedProductId : any= successfulServerRequestData;
            productToAdd.productId = insertedProductId;
            let hostUrl = "http://34.65.6.110:3001/";
            productToAdd.productImage = hostUrl + productToAdd.productImage;
            this.productsService.allProducts.push(productToAdd);
            this.productsService.isProductAdded = true;
            this.dialogRef.close(true);


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
