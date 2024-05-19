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


module.exports = validate;