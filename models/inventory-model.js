const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a specific vehicle info by inv_id
 * ************************** */

async function getVehicleDetailsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i  
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleDetailsByInvId error " + error)
  }
}

/* ***************************
 *  Add classification to classification table
 * ************************** */

async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1)'
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error('Error adding classification:', error);
    throw error;
  }
}

/* ***************************
 *  Check existing classifications
 * ************************** */
async function checkExistingClassifications(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}


/* ***************************
 *  Add inventory to inventory table
 * ************************** */

async function addInventory(
  classification_id,inv_make, 
  inv_model, inv_year, 
  inv_description, inv_image, inv_thumbnail, 
  inv_price, inv_miles, inv_color) {

  try {
    const sql = 'INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    return await pool.query(sql, [classification_id,inv_make, 
      inv_model, inv_year, 
      inv_description, inv_image, inv_thumbnail, 
      inv_price, inv_miles, inv_color]);
  } catch (error) {
    console.error('Error adding inventory:', error);
    throw error;
  }
}



module.exports = {getClassifications, 
  getInventoryByClassificationId, 
  getVehicleDetailsByInvId,
  addClassification,
  checkExistingClassifications,
  addInventory
};