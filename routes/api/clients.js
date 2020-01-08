// pull in required dependancies and load the input validations, and then the user model
const express = require('express');
const router = express.Router();

// User Model
const User = require('../../models/User');

// @route GET /clients
// @desc Returns all the clients in the db
// @access Public
router.get('/', (req, res) => {
  User.find({ userType: 'client' }, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// @route GET /editclient
// @desc Returns info for one client
// @access Public
router.get('/editclient/:clientId', (req, res) => {
  User.findOne({ _id: req.params.clientId }, function(err, client) {
    if (err) {
      console.log(err);
    } else {
      console.log(client);
      res.json(client);
    }
  });
});

// export the router so it can be used elsewhere
module.exports = router;
