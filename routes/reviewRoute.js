const express = require("express");
const router = new express.Router();
const reviewCont = require("../controllers/reviewController");
const utilities = require("../utilities/");
const reviewVal = require("../utilities/review-validation");

/* ************************************
 *  Insert new review
 *  ******************************** */
router.post(
  "/insert",
  utilities.checkLogin,
  reviewVal.reviewRule(),
  reviewVal.checkReview,
  utilities.handleErrors(reviewCont.insertReview)
);

/* ************************************
 *  Get review for edit
 *  ******************************** */
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewCont.editReview)
);

/* ************************************
 *  Update review
 *  ******************************** */
router.post(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(reviewCont.updateReview)
);

/* ************************************
 *  Get review for delete
 *  ******************************** */
router.get(
  "/remove/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewCont.removeReview)
);

/* ************************************
 *  Delete review
 *  ******************************** */
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewCont.deleteReview)
);

module.exports = router;