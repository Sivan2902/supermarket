import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService';

@Component({
  selector: 'app-admin-searched-product',
  templateUrl: './admin-searched-product.component.html',
  styleUrls: ['./admin-searched-product.component.css']
})
export class AdminSearchedProductComponent implements OnInit {

  constructor(public productsService : ProductsService,
              private dialogRef : MatDialogRef<AdminSearchedProductComponent>) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('30%', '80%');
  }

  public switchEditModeOn() {

    this.productsService.isEditModeOn = true;
    this.dialogRef.close(true);
  }
}
