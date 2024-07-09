import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  loggedUserId: string;

  constructor(
    private cartService: CartService,
    private localStorageService: LocalStorageService
  ) {
    this.loggedUserId = this.localStorageService.getItem('loggedUserId') || '0';
  }

  ngOnInit(): void {
    this.clearCart();
  }

  clearCart(): void {
    this.cartService.getCartByID(this.loggedUserId).subscribe((cart) => {
      this.cartService.clearCart(cart.id).subscribe(() => {
        console.log('Cart cleared successfully');
      }, (error) => {
        console.error('Error clearing cart:', error);
      });
    });
  }
}
