import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { CartService } from '../../services/cart.service';
import { Assessment } from '../../models/assessment';
import { Cart } from '../../models/cart';
import { TraineeService } from '../../services/trainee.service';
import { AssessmentTrainees } from '../../models/assessmentTrainess';
import { loadStripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  currentUserCart: Cart = new Cart(0, 0, [], [], 0);
  loggedUserId: string = '';
  stripePromise = loadStripe('pk_test_51PaVS0AdmJTZG1A1t6DsmTxd1RhRX4Z7yNcyZVtAw3RIqPAyPI14AfGFXLyXm0cYB1KDyOXaGtSTtSdHvUfbs7TH00nyPL9XNW');

  constructor(
    private traineeService: TraineeService,
    private localStorageService: LocalStorageService,
    private cartService: CartService
  ) {
    let loggedId = localStorageService.getItem('loggedUserId');
    if (loggedId === null) {
      loggedId = '0';
    }
    this.loggedUserId = loggedId;
    this.cartService.getCartByUserId(this.loggedUserId).subscribe((data) => { 
      this.currentUserCart = JSON.parse(data.cart) ; 
    });
  }

  calculateCost() {
    let cost = 0;
    for (let i = 0; i < this.currentUserCart.arrAssessments.length; i++) {
      cost +=
        this.currentUserCart.quantity[i] *
        this.currentUserCart.arrAssessments[i].price;
    }
    return cost;
  }
  
  renamekey(obj:any, oldkey:any, newkey:any) {
    obj[newkey] = obj[oldkey];
    delete obj[oldkey];
  }
  addQuantity(addAssessmentId: number) {
    this.cartService.getCartByUserId(this.loggedUserId).subscribe((data) => {
      let currentCart = JSON.parse(data.cart) ; 
      this.renamekey(currentCart , '_id' , 'id') ;
      this.currentUserCart = currentCart;
      this.currentUserCart.quantity[addAssessmentId] += 1 ; 
      this.currentUserCart.total = this.calculateCost();
      this.cartService.updateCartById(this.currentUserCart.id , this.currentUserCart).subscribe((data) => {
        'updated cart on increment'
      });
    });
  }

  removeQuantity(removeAssessmentId: number) {
    this.cartService.getCartByUserId(this.loggedUserId).subscribe((data) => {
      let currentCart = JSON.parse(data.cart) ; 
      this.renamekey(currentCart , '_id' , 'id') ;
      this.currentUserCart = currentCart;
      this.currentUserCart.quantity[removeAssessmentId] -= 1 ;
      if(  this.currentUserCart.quantity[removeAssessmentId] == 0){
        this.currentUserCart.quantity.splice(removeAssessmentId , 1) ; 
        this.currentUserCart.arrAssessments.splice(removeAssessmentId , 1) ; 
      } 
      this.currentUserCart.total = this.calculateCost();
      this.cartService.updateCartById(this.currentUserCart.id , this.currentUserCart).subscribe((data) => {
        'updated cart on decrement'
      });
    });
  }

  getTotalCost() {
    return this.currentUserCart.total;
  }
  addAssessmentsToDashboard(){
    console.log('addassessments to dashboard')
    this.traineeService.getAssessmentTrainess().subscribe(data => {
      // search for every assessment in cart in the directory
      let arrAss = this.currentUserCart.arrAssessments ; 
      arrAss.forEach((ass , index) => {
        // check if it exists already 
        let exists = false ; 
        for(let i = 0 ; i < data.length ; i++){
          if(data[i].assessmentId == ass.id.toString() && data[i].traineeId == this.loggedUserId){
            data[i].quantity += this.currentUserCart.quantity[index] ; 
            // let assTraineeCopy = data[i] ; 
            console.log('assessment already exists') ;
            this.traineeService.updateAssessmentTraineeById(Number(data[i].id) , data[i]).subscribe(data => {
                console.log('updated assessment that already exists')
            })
            break ; 
          }
        }

        if(!exists){
          this.traineeService.getAssessmentTrainess().subscribe(data => {
            let newId = data.length + 1 ; 
            let newAssTrainee = new AssessmentTrainees(newId.toString() , ass.id.toString() , this.loggedUserId , this.currentUserCart.quantity[index])
            this.traineeService.addAssessmentTrainee(newAssTrainee).subscribe(data => {
              console.log('add assessment trainee since it didnt exist')
            })
          })
        }
      })
    })
  }
  async placeOrder() {
    // put things in dashbooard
    this.addAssessmentsToDashboard() ;

    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe did not load correctly.');
      return;
    }
  
    // Create a Stripe Checkout Session
    const sessionId = await this.createCheckoutSession();
  
    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Error redirecting to Stripe Checkout:', error);
    }

  }
  

  async createCheckoutSession(): Promise<string> {
    const items = this.currentUserCart.arrAssessments.map((assessment, index) => ({
      name: assessment.assessmentName,
      price: assessment.price,
      quantity: this.currentUserCart.quantity[index]
    }));

    try {
      const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });

      const session = await response.json();
      return session.id;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return '';
    }
  }
}
