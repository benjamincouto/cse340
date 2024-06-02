const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the specific vehicle view HTML
* ************************************ */
Util.buildVehicleDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<section id="vehicle-display">'
      grid +='<img src="' + data[0].inv_image +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
      +' on CSE Motors" />'
      grid += '<div>' + '<h3>'+ data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
      grid +='</h3>'
      
      grid +='<ul>'
      grid +='<li>'+ '<strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</li>'
      grid +='<li>'+ '<strong>Description:</strong> ' + data[0].inv_description + '</li>'
      grid +='<li>'+ '<strong>Color:</strong> ' + data[0].inv_color + '</li>'
      grid +='<li>'+ '<strong>Mileage:</strong> ' + data[0].inv_miles +  '</li>'
      grid +='</ul>'
      grid +='</div>'
         
    grid += '</section>'
  } else { 
    grid += '<p class="notice">Sorry, the vehicle is not available.</p>'
  }
  return grid
}

/* **************************************
* Build classification list for the add-inventory view
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedIn = 1
        next()
      }
    )
  } else {
    next()
  }
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Account Type (restrict access to non Admin or Employee)
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedIn) {
    if (res.locals.accountData.account_type == 'Admin' || res.locals.accountData.account_type == 'Employee') {
      next()
    } else {
      return res.redirect("/account/login")
    }
  }
}

/* **************************************
* Build the detail view review list
* Review Final Project
* ************************************ */
Util.buildReviewList = function(data){
  let list = '<ul id="rvw-display">'
  if(data.length > 0){
    data.forEach(review => { 
      let reviewDate = new Date(review.review_date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      let displayDate = reviewDate.toLocaleDateString('en-US', options)
      list += `<li>
      <strong>${review.account_firstname.slice(0,1)}${review.account_lastname}</strong>&nbsp;wrote on ${displayDate}
      <hr />
      <div>
      ${review.review_text}
      </div>
      </li>`
    })
    list += '</ul>'
  } else { 
    list = '<p class="notice">Be the first to write a review.</p>'
  }
  return list
}

/* **************************************
* Build the review list for account management
* Review Final Project
* ************************************ */
Util.buildAccountReviewList = function(reviews){
  let list = '<ol>'
  if(reviews.length > 0){
    reviews.forEach(review => { 
      let reviewDate = new Date(review.review_date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      let displayDate = reviewDate.toLocaleDateString('en-US', options)
      list += `<li>Reviewed the 
      ${review.inv_year} ${review.inv_make} ${review.inv_model}&nbsp;on ${displayDate} | <a href="/review/edit/${review.review_id}">Edit</a> | <a href="/review/remove/${review.review_id}">Delete</a>
      </li>`
    })
    list += '</ol>'
  } else { 
    list = '<p class="notice">You have not written any reviews.</p>'
  }
  return list
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util