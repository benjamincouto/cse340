const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")


/*  **********************************
*  classification_name Validation Rules
* ********************************* */

validate.classificationNameRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z]+$/)
      .isLength({ min: 3 })
      .withMessage("Please provide a valid classification name.")
      .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClassifications(classification_name)
        if (classExists > 0){
          throw new Error("Classification already exists. Please review the request.")
        }
      }),
  ]
}

validate.checkClassNameData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
*  add-inventory Validation Rules
* ********************************* */

validate.inventoryRules = () => {
  return [
    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please select a classification"),

    // make is required and must be string
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("The make should have 3 or more characters"),

    // model is required and must be string
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("The model should have 3 or more characters"),

    // inv_image path is required and must be string
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a valid path for the image"),

    // inv_image path is required and must be string
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a valid path for the thumbnail"),

    // price is required and it may include integers and decimals
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .matches(/^\d+(\.\d+)?$/)
    .withMessage("Please provide a valid price"),

    // year is 4-digit and required
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 4 })
    .matches(/\d{4}/)
    .withMessage("Please provide a valid 4-digit year"),

    // miles is required, it should only include integers
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .matches(/\d+/)
    .withMessage("Please provide the mileage, only integer values allowed"),

    // color is required, it should only include alphabetic characters
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .matches(/[a-zA-Z]+/)
    .withMessage("Please provide a valid color, only alphabetic characters allowed."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { classification_id,inv_make, 
    inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classDropDown = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classDropDown,
      classification_id,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color 
    })
    return
  }
  next()
}


module.exports = validate;