const express = require("express");
const util = require("./util/util");
const cors = require("cors");
const bodyParser = require("body-parser");
const generic_controller = require("./controller/generic_controller");
const db_service = require("./services/db_service");
const jwt = require("jsonwebtoken");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = 3000;

// Load environment variables
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Define routes for each collection
const collections = [
  "assessments",
  "assessmentScore",
  "assessmentTrainees",
  "attendance",
  "cart",
  "coursecategories",
  "courses",
  "reports",
  "users",
];

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  //  res.send(token)
  if (!token) {
    console.log('Invalid bearer token', token)
    return res.status(401).json({
        error : 'Bearer token invalid'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error : 'Token did not match , verification failed '
      })
    }
    req.user = decoded ;
    next();
  });
};

// Stripe Checkout Session creation endpoint
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });
  res.json({ id: session.id });
});

// Stripe webhook to handle checkout session completion
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update the order status in your database here
      console.log(`Payment for session ${session.id} was successful!`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

collections.forEach((collection) => {
  if(collection == 'assessments'){
    app.get(`/${collection}`,  generic_controller.getDocuments(collection));
    app.get(`/${collection}/:id`, generic_controller.getDocumentById(collection));
  }
  else{
    app.get(`/${collection}`,  authenticateToken, generic_controller.getDocuments(collection));
    app.get(`/${collection}/:id`, authenticateToken , generic_controller.getDocumentById(collection));
  }
  app.post(`/${collection}`, authenticateToken , generic_controller.addDocument(collection));
  
  app.put(`/${collection}/:id`, authenticateToken , generic_controller.updateDocument(collection));
  app.delete(`/${collection}/:id`, authenticateToken , generic_controller.deleteDocument(collection)
  );
});

app.get(`/cart/user/:id` , generic_controller.getCartByUserId('cart')) ; 

app.post("/login", (req, res) => {
  const userDetails = req.body;
  const email = userDetails.email;
  const password = userDetails.password;
  generic_controller
    .getUserByCredentials("users", userDetails)
    .then((foundUser) => {
      console.log('inside server js login route' ,foundUser)
        const token =  jwt.sign(foundUser , process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log('token' , token) ; 
        res.json({
            user : foundUser,
            token : token
        })
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

