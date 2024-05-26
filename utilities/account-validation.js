const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const accountModel = require("../models/account-model")


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
            throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  


/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
      // valid email is required and must exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
            throw new Error("Email is not registered. Please Sign-Up.")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


    /* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
}

    /* ******************************
 * Update account validation
 * ***************************** */

validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Please provide a first name.")
      .isLength({ min: 1, max: 255 })
      .withMessage("First name must be between 1 and 255 characters."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Please provide a last name.")
      .isLength({ min: 1, max: 255 })
      .withMessage("Last name must be between 1 and 255 characters."),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an email.")
      .isEmail()
      .withMessage("Please provide a valid email."),
  ];
};

validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/update-account-details", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }
  next();
};

    /* ******************************
 * Validate change password
 * ***************************** */

validate.changePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please provide a password.")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage("Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."),
  ];
};

validate.checkChangePasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/change-password", {
      errors: errors.array(),
      title: "Change Password",
      nav,
    });
  }
  next();
};

  module.exports = validate