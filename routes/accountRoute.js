// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const baseController = require("../controllers/baseController")

// Route to login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post registration
router.post('/register', regValidate.registrationRules(),regValidate.checkRegData,utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,

    utilities.handleErrors(accountController.accountLogin)
  )

// Account Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Account Update View
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate))

// Route to process account updates
router.post(
  "/update-account-details", 
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData, 
  utilities.handleErrors(accountController.updateAccountDetails))

// Route to change password
router.post(
  "/change-password", 
  utilities.checkLogin,
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData, 
  utilities.handleErrors(accountController.changePassword))

// Route to logout
router.get('/logout', utilities.handleErrors(accountController.logoutFromAccount))

module.exports = router;