// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post registration
router.post('/register', regValidate.registrationRules(),regValidate.checkRegData,utilities.handleErrors(accountController.registerAccount));


module.exports = router;