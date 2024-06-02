const invModel = require("../models/inventory-model")
const rvwModel = require("../models/review-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 *  Modified for Review Final Project
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const vehicleData = await invModel.getVehicleDetailsByInvId(inv_id)
  res.locals.inv_id = inv_id // review form
  const grid = await utilities.buildVehicleDetailsGrid(vehicleData)
  const reviews = await rvwModel.getReviewsByInvId(inv_id)
  const reviewDisplay = utilities.buildReviewList(reviews)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicleDetails", {
    title: vehicleData[0].inv_year + ' ' + vehicleData[0].inv_make + ' ' + vehicleData[0].inv_model,
    nav,
    message: null,
    grid,
    reviewDisplay,
  })
}

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classDropDown = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classDropDown,
    errors: null,
  })
}

/* ****************************************
*  Build add-classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process add-classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name);

  if (addResult) {
    req.flash(
      "notice",
      `You have registered ${classification_name} as a new classification.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the add-classification process failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
*  Build add-inventory view
* *************************************** */
invCont.buildAddNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classDropDown = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classDropDown,
    errors: null,
  })
}


/* ****************************************
*  Process add-inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classDropDown = await utilities.buildClassificationList()
  const { classification_id, 
    inv_make, inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color} = req.body

  const invResult = await invModel.addInventory(
    classification_id,inv_make, inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color);

  if (invResult) {
    req.flash(
      "notice",
      "Succesfully added to our inventory."
    )
    let nav = await utilities.getNav()
    let classDropDown = await utilities.buildClassificationList()
    res.status(201).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classDropDown,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the add-inventory process failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Classification",
      nav,
      classDropDown,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Modify Inventory View
 * ************************** */
invCont.buildModifyInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetailsByInvId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  let classDropDown = await utilities.buildClassificationList(itemData[0].classification_id)
  res.render("./inventory/modify-inventory", {
    title: "Modify " + itemName,
    nav,
    classDropDown: classDropDown,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ****************************************
*  Process modify/update-inventory
* *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, 
    inv_make, inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color, inv_id} = req.body

  const updateResult = await invModel.updateInventory(
    inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color, 
    classification_id, inv_id);

  if (updateResult) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash(
      "notice",
      `The ${itemName} was succesfully updated.`)
    res.redirect("/inv/") 
  } else {
    let classDropDown = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/modify-inventory", {
      title: "Modify " + itemName,
      nav,
      errors: null,
      classDropDown: classDropDown,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.buildDeleteInventoryConfirmation = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetailsByInvId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ****************************************
*  Process delete-inventory
* *************************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    req.flash(
      "notice",
      "The deletion was succesfull.")
    res.redirect("/inv/") 
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.redirect(`/inv/delete/${inv_id}`) 
  }
}


module.exports = invCont;
