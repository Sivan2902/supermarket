import { Component, OnInit } from '@angular/core';
import { shoppingCartService } from 'src/app/services/shoppingCartService'

@Component({
  selector: 'app-delete-cart',
  templateUrl: './delete-cart.component.html',
  styleUrls: ['./delete-cart.component.css']
})
export class DeleteCartComponent implements OnInit {



  constructor( public shoppingCartService : shoppingCartService) { }

  ngOnInit(): void {
  }


  public deleteCart() {
    this.shoppingCartService.isCartDeletionConfirmed = true;
  }


  public keepCurrentCart() {
    this.shoppingCartService.isCartDeletionConfirmed = false;
  }

}
