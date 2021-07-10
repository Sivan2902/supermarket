import { Component, OnInit } from '@angular/core';
import { PurchaseService } from 'src/app/services/purchasesService';

@Component({
  selector: 'app-last-purchase-dialog',
  templateUrl: './last-purchase-dialog.component.html',
  styleUrls: ['./last-purchase-dialog.component.css']
})
export class LastPurchaseDialogComponent implements OnInit {

  public purchaseDate : string;
  public totalPrice : string;
  constructor(public purchasesService : PurchaseService) { }

  ngOnInit(): void {
  }

}
