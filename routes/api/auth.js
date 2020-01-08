const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

const helpers = require('../../helpers/helpers');

// @route POST api/auth
// @desc Authenticate the user
// @access Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    // bad request
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      // check expiry date against todays date and if out of date don't allow user in and display error message
      const expiryDate = new Date(user.expiryDate);
      const todaysDate = new Date();

      if (Date.parse(todaysDate) > Date.parse(expiryDate)) {
        return res.status(400).json({ msg: 'Account has expired, please contact a member of the sales team' });
      }

      jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType
          }
        });
      });
    });
  });
});

// @route GET api/auth/user
// @desc Get user data
// @access Private
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    // disregard the password
    .select('-password')
    .then(user => res.json(user));
});

// export the router so it can be used elsewhere
module.exports = router;
