// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details by 
router.get("/detail/:inv_id", invController.buildByInvId);

// Route to build management
router.get("", invController.buildManagement);

// Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to post to database at add classification
router.post(
    "/add-classification", 
    invValidation.classificationNameRules(),
    invValidation.checkClassNameData,
    utilities.handleErrors(invController.addClassification));


// Route to add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddNewInventory));


// Route to post to database at add classification
router.post(
    "/add-inventory", 
    invValidation.inventoryRules(),
    invValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory));


// Route to inventory management using inventory.js
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON)) 

// Modify Inventory View route
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildModifyInventory))

// Route to process Inventory modification
router.post(
    "/update/",
    invValidation.inventoryRules(),
    invValidation.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))


module.exports = router;