const express = require("express");
const util = require("./util/util");
const cors = require("cors");
const bodyParser = require("body-parser");
const generic_controller = require("./controller/generic_controller");
const db_service = require("./services/db_service");
const jwt = require("jsonwebtoken");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const port = 3000;

// Load environment variables
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Replace with your frontend origin
}));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage configuration with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder where files will be stored in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

const upload = multer({ storage: storage });


// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log("req.file" , req.file)
    return res.status(400).send('No file uploaded.');
  }
  
  // File is successfully uploaded to Cloudinary
  const fileUrl = req.file.path;  // Cloudinary URL

  res.json({ url: fileUrl });
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
cons = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: 'Bearer token invalid'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Token did not match, verification failed'
      });
    }
    req.user = decoded;
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
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
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
      console.log(`Payment for session ${session.id} was successful!`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.get(`/fetchUsers`, generic_controller.getDocuments("users"));

collections.forEach((collection) => {
  if (collection == 'assessments' || collection == 'users') {
    app.get(`/${collection}`, generic_controller.getDocuments(collection));
    app.get(`/${collection}/:id`, generic_controller.getDocumentById(collection));
  } else {
    app.get(`/${collection}`, generic_controller.getDocuments(collection));
    app.get(`/${collection}/:id`, generic_controller.getDocumentById(collection));
  }

  if (collection == 'users') {
    app.post(`/${collection}`, generic_controller.addDocument(collection));
  }
  else {
    app.post(`/${collection}`, generic_controller.addDocument(collection));
  }
  
  
  app.put(`/${collection}/:id`, generic_controller.updateDocument(collection));
  app.delete(`/${collection}/:id`, generic_controller.deleteDocument(collection));
});

app.get(`/cart/user/:id`, generic_controller.getCartByUserId('cart'));



app.post("/login", (req, res) => {
  const userDetails = req.body;
  const email = userDetails.email;
  const password = userDetails.password;
  generic_controller
    .getUserByCredentials("users", userDetails)
    .then((foundUser) => {
      const token = jwt.sign(foundUser, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({
        user: foundUser,
        token: token
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

app.post('/register' , generic_controller.addDocument('users'));

