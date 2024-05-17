// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route to login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post registration
router.post('/register', utilities.handleErrors(accountController.registerAccount));


module.exports = router;