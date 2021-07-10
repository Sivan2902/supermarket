import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PurchaseService } from 'src/app/services/purchasesService';
import { receiptDetails } from 'src/models/receiptDetails';

@Component({
  selector: 'app-close-purchase-dialog',
  templateUrl: './close-purchase-dialog.component.html',
  styleUrls: ['./close-purchase-dialog.component.css']
})
export class ClosePurchaseDialogComponent implements OnInit {

  public receiptDetails : receiptDetails[];
  public totalCost : string;

  constructor(private purchaseService : PurchaseService,
              private dialogRef: MatDialogRef<ClosePurchaseDialogComponent>) {  
                
                this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    this.totalCost = this.purchaseService.totalReceiptCost;
    this.receiptDetails = this.purchaseService.receipt;

    let receiptText = 'Purchase Items: \r\n';
    receiptText += this.getAllReceiptItems();
    receiptText += '\r\nTotal cost: ' + this.totalCost + " NIS";

    let data = new Blob([receiptText], {type: 'text/plain'});

    let url = window.URL.createObjectURL(data);

    let path = document.getElementById('downloadLink');
    path.setAttribute('href', url);

  }

  public getAllReceiptItems() {

    let receiptItems = '';

    this.receiptDetails.forEach( item => {
      
      receiptItems += item.productName + " ........." + item.totalPrice + "\r\n";
    });

    return receiptItems;

  }

}

