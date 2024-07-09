const express = require("express");
const util = require("./util/util");
const cors = require("cors");
const bodyParser = require("body-parser");
const generic_controller = require("./controller/generic_controller");
const db_service = require("./services/db_service");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

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

collections.forEach((collection) => {
  if(collection === 'assessments'){
    app.get(`/${collection}`,  generic_controller.getDocuments(collection));
  }
  else{
    app.get(`/${collection}`,  authenticateToken, generic_controller.getDocuments(collection));
  }
  app.get(`/${collection}/:id`, authenticateToken , generic_controller.getDocumentById(collection));
  app.post(`/${collection}`, authenticateToken , generic_controller.addDocument(collection));
  app.put(`/${collection}/:id`, authenticateToken , generic_controller.updateDocument(collection));
  app.delete(`/${collection}/:id`, authenticateToken , generic_controller.deleteDocument(collection)
  );
});



app.post("/login", (req, res) => {
  const userDetails = req.body;
  const email = userDetails.email;
  const password = userDetails.password;
  generic_controller
    .getUserByCredentials("users", userDetails)
    .then((foundUser) => {
        
        const token =  jwt.sign(foundUser , process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            user : foundUser,
            token : token
        })
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});


