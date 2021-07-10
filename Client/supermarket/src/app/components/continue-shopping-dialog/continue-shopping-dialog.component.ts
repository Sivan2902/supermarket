import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CartItemsService } from 'src/app/services/cartItemsService';

@Component({
  selector: 'app-continue-shopping-dialog',
  templateUrl: './continue-shopping-dialog.component.html',
  styleUrls: ['./continue-shopping-dialog.component.css']
})
export class ContinueShoppingDialogComponent implements OnInit {

  constructor(public cartItemsService : CartItemsService,
              private dialogRef: MatDialogRef<ContinueShoppingDialogComponent>) { 
                
                this.dialogRef.disableClose = true;
              }
    


  public continueShopping() {

    this.cartItemsService.continueShoppingDialogInput = "Continue Shopping";

  }

  public getNewCart() {
    
    this.cartItemsService.continueShoppingDialogInput = "Open a new cart";
  }
  ngOnInit(): void {
  }

}
