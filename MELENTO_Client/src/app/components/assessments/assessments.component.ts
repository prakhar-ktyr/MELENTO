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
            this.cartService.addAssessmentToCart(Number(cartId), data).subscribe((data) => { });
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
}
