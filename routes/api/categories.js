// pull in required dependancies and load the input validations, and then the user model
const express = require('express');
const router = express.Router();

// Category Model
const Category = require('../../models/Category');

// @route GET /categories
// @desc Returns all the categories in the db
// @access Public
router.get('/', (req, res) => {
  Category.find(function(err, categories) {
    if (err) {
      console.log(err);
    } else {
      res.json(categories);
    }
  });
});

// export the router so it can be used elsewhere
module.exports = router;
