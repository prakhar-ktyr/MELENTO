import { Component, OnInit } from '@angular/core';
import { Assessment } from '../../models/assessment';
import { AssessmentService } from '../../services/assessment.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Cart } from '../../models/cart';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component'; 

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  loggedUserId: string = "";
  arrAssessments: Assessment[] = [];
  pagedAssessments: Assessment[] = [];
  assessment: Assessment = new Assessment(0, "", "", "", [], 0, 0, "");
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  constructor(
    private assessmentService: AssessmentService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private dialog: MatDialog // Add this
  ) {
    let loginId = this.localStorageService.getItem("loggedUserId");
    this.loggedUserId = loginId === null ? "0" : loginId;
  }

  ngOnInit(): void {
    this.assessmentService.getAssessments().subscribe((assessments: Assessment[]) => {
      this.arrAssessments = assessments;
      this.totalPages = Math.ceil(this.arrAssessments.length / this.pageSize);
      this.totalPagesArray = Array(this.totalPages).fill(0).map((x, i) => i + 1);
      this.updatePagedAssessments();
    });
  }

  updatePagedAssessments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedAssessments = this.arrAssessments.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedAssessments();
  }

  displayDetails(aid: number, aName: string, aDescription: string): void {
    this.router.navigate(["viewDetails/" + aid]);
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
}
