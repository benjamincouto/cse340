// Needed Resources 
const express = require("express");
const router = new express.Router();
const intentionalErrorController = require('../controllers/intentionalErrorController');

router.get('/intentional-error', intentionalErrorController.generateError);

module.exports = router;