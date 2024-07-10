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
  calculateCost(currentUserCart:any) {
    let cost = 0;
    for (let i = 0; i < currentUserCart.arrAssessments.length; i++) {
      cost +=
        currentUserCart.quantity[i] *
        currentUserCart.arrAssessments[i].price;
    }
    return cost;
  }
  addToCart(newAssessmentForCart: Assessment): void {
    // check if cart exists 
    let userId = this.loggedUserId ; 
    this.cartService.getCartByUserId(userId).subscribe(data => { 
       console.log(data);
       if(data.found){
         // cart exists        
         let currentCart = JSON.parse(data.cart) ; 
         console.log(typeof data)
         console.log(data)
         // check if new assessment exists in arrAssessments 
         let assessmentExists = false ; 
         for(let i = 0 ; i < currentCart.arrAssessments.length ; i++){
           if(currentCart.arrAssessments[i].id == newAssessmentForCart.id){
             currentCart.quantity[i] += 1 ;
             assessmentExists = true ; 
             break ; 
           }
         }
         console.log('***** ok2 ***********')
         if(!assessmentExists){
           currentCart.arrAssessments.push(newAssessmentForCart) ; 
           currentCart.quantity.push(1) ; 
         }

         currentCart.total = this.calculateCost(currentCart) ; 
         // update cart
         this.cartService.updateCartById(currentCart._id , currentCart).subscribe(data => {
           console.log('updated cart') ; 
         })
       }
       else{
         // create new cart 
         let newCart: Cart = new Cart(Number(userId) ,Number( userId ), [newAssessmentForCart] , [1] , newAssessmentForCart.price) ; 
           this.cartService.addNewCart(newCart).subscribe(data => {
             console.log('Data added to cart') ;
           })
       }
    })
  }

  viewMore(): void {
    this.router.navigate(['/assessments']);
  }
}
