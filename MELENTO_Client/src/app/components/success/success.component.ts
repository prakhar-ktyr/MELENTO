import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { TraineeService } from "../../services/trainee.service";
import { AssessmentTrainees } from "../../models/assessmentTrainess";
import { Cart } from "../../models/cart";

@Component({
  selector: "app-success",
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.scss"],
})
export class SuccessComponent implements OnInit {
  loggedUserId: string;
  constructor(
    private cartService: CartService,
    private localStorageService: LocalStorageService,
    private traineeService: TraineeService
  ) {
    this.loggedUserId = this.localStorageService.getItem("loggedUserId") || "0";
  }

  ngOnInit(): void {
    this.handleClearCart();
  }
  clearCart(id:any){
       this.cartService.clearCart(id).subscribe(
        () => {
          console.log("Cart cleared successfully");
        },
        (error) => {
          console.error("Error clearing cart:", error);
        }
      );
  }
  handleClearCart(): void {
    this.cartService.getCartByUserId(this.loggedUserId).subscribe((data) => {
      console.log("inside success", data);
      let cart = JSON.parse(data.cart);
      let id = cart._id;
      console.log(cart);
      this.clearCart(id) ; 
    });
  }
}
