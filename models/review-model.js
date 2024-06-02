const pool = require("../database/")

/* ***************************
 *  Get reviews by inventory id
 *  For use in the vehicle detail view
 * ************************** */
async function getReviewsByInvId(inv_id) {
    try {
    const sql = 'SELECT review_text, review_date, account_firstname, account_lastname FROM review JOIN account ON review.account_id = account.account_id WHERE review.inv_id = $1 ORDER BY review_date DESC';
    const data = await pool.query(sql, [inv_id])
    return data.rows
    } catch (error) {
        console.error("review by inv_id error: " + error)
      }
   }
   
/* ***************************
 *  Get reviews by account id
 *  For use in the account management view
 * ************************** */
 async function getReviewsByAccountId(account_id) {
    try{
    const sql = 'SELECT review_id, review_date, inv_make, inv_model, inv_year FROM review JOIN inventory ON review.inv_id = inventory.inv_id WHERE review.account_id = $1 ORDER BY review_date DESC';
    const data = await pool.query(sql, [account_id])
    return data.rows
    } catch (error) {
        console.error("review by account_id error: " + error)
      }
   }

/* ***************************
 *  Get review by id
 *  For use in the edit and delete processes
 * ************************** */
async function getReviewById(review_id) {
    try {
    const sql = 'SELECT review_id, review_text, review_date, inv_make, inv_model, inv_year FROM review JOIN inventory ON review.inv_id = inventory.inv_id WHERE review_id = $1';
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
   } catch (error) {
    console.error("review by id error: " + error)
   }
  }

/* ***************************
 *  Insert new review
 * ************************** */
async function insertReview(review_text, account_id, inv_id) {
    try {
      const sql =
        "INSERT INTO public.review (review_text, account_id, inv_id) VALUES ($1, $2, $3)"
      const result = await pool.query(sql, [review_text, account_id, inv_id])

      const params = [reviewText, accountId, invId];
      console.log('Insert Review Params:', params); // Log the parameters
      return result.rowCount
    } catch (error) {
      console.error("review insert error: " + error)
    }
  }

/* ***************************
 *  Update review
 * ************************** */
async function updateReview(review_id, review_text) {
    try {
    const sql = 'UPDATE review SET review_text = $1 WHERE review_id = $2';
    const result = await pool.query(sql, [review_text, review_id])
    return result.rowCount
   } catch (error) {
    console.error("review update error: " + error)
   }
  }

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(review_id) {
  try {
  const sql = 'DELETE FROM review WHERE review_id = $1';
  const result = await pool.query(sql, [review_id])
  return result.rowCount
 } catch (error) {
  console.error("review deletion error: " + error)
 }
}

  module.exports = {getReviewsByInvId, getReviewsByAccountId, getReviewById, insertReview, updateReview, deleteReview}