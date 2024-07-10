import { Component } from '@angular/core';
import { Assessment } from '../../models/assessment';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AssessmentService } from '../../services/assessment.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  arrAssessments: Assessment[] = [];
  loggedUserId: string = '0';

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private dialog: MatDialog
  ) {
    this.assessmentService.getAssessments().subscribe((data) => {
      for (let i = data.length - 1; i >= data.length - 3; i--) {
        this.arrAssessments.push(data[i]);
      }
    });
    let loginId = this.localStorageService.getItem('loggedUserId');
    this.loggedUserId = loginId === null ? '0' : loginId;
  }

  displayDetails(aid: number, aName: string, aDescription: string) {
    this.router.navigate(['viewDetails/' + aid]);
  }

  handleAddToCart(newAssessmentForCart: Assessment): void {
    if (!this.isLoggedIn()) {
      this.openLoginModal();
    } else {
      this.addToCart(newAssessmentForCart);
    }
  }

  isLoggedIn(): boolean {
    return this.localStorageService.getItem('loggedUserId') !== null;
  }

  openLoginModal(): void {
    this.dialog.open(LoginModalComponent); // Open the Angular Material Dialog for login
  }

  addToCart(newAssessmentForCart: Assessment): void {
    let cartExists = false;
    let arrCart: Cart[] = [];
    let cartId = this.localStorageService.getItem('loggedUserId');

    if (cartId === null) {
      console.log("User not logged in , can't add to cart");
      return;
    }

    this.cartService.getCarts().subscribe(data => {
      arrCart = data;
      for (let i = 0; i < arrCart.length; i++) {
        if (String(arrCart[i].userId) === this.loggedUserId) {
          cartExists = true;
          break;
        }
      }

      if (cartExists) {
        this.cartService.getCartByID(String(cartId)).subscribe((data) => {
          let assessmentExistsInCart = false;
          for (let i = 0; i < data.arrAssessments.length; i++) {
            if (data.arrAssessments[i].id === newAssessmentForCart.id) {
              data.quantity[i] += 1;
              assessmentExistsInCart = true;
              this.cartService.updateCartById(data.id, data).subscribe(data => { });
              break;
            }
          }

          if (!assessmentExistsInCart) {
            data.arrAssessments.push(newAssessmentForCart);
            data.quantity.push(1);
            this.cartService.updateCartById(Number(cartId), data).subscribe((data) => { });
          }
        });
      } else {
        let obj = {
          id: this.loggedUserId,
          userId: this.loggedUserId,
          quantity: [1],
          total: newAssessmentForCart.price,
          arrAssessments: [newAssessmentForCart]
        }
        this.cartService.addNewCart(obj).subscribe(data => {
          console.log("added cart")
        })
      }
    })
  }

  viewMore(): void {
    this.router.navigate(['/assessments']);
  }
}
