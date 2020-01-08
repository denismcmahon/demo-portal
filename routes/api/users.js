const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

const auth = require('../../middleware/auth');

// @route POST api/users
// @desc Register new user and generate token and access
// @access Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    // bad request
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password
    });

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email
              }
            });
          });
        });
      });
    });
  });
});

// @route POST api/users/addclient
// @desc Register/Create new client user
// @access Public
router.post('/addclient', auth, (req, res) => {
  const { name, email, expiryDays, userType, password } = req.body;

  let expiryDate;

  let date = new Date();
  expiryDate = date.setDate(date.getDate() + parseInt(expiryDays));

  // Simple validation
  if (!name || !email || !password) {
    // bad request
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (/\s/.test(email)) {
    return res.status(400).json({ msg: 'Login Id must not contain spaces' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    } else {
      const newUser = new User({
        name,
        email,
        userType,
        expiryDate,
        password
      });

      // Create salt and hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save(function(err) {
            // If there's an error
            if (err) {
              return res.status(400).json({ msg: 'There has been a problem registering the user' });
            } else {
              res.status(200).json({ status: 'ok' });
            }
          });
        });
      });
    }
  });
});

// @route PUT api/users/editclient
// @desc Update the client user based on id
// @access Public
router.put('/editclient/:clientId', auth, (req, res) => {
  const { name, email, expiryDays, userType, password } = req.body;

  let expiryDate;

  let date = new Date();
  expiryDate = date.setDate(date.getDate() + parseInt(expiryDays));

  // Simple validation
  if (!name || !email || !password) {
    // bad request
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (/\s/.test(email)) {
    return res.status(400).json({ msg: 'Login Id must not contain spaces' });
  }

  // Check for existing user
  User.findOne({ _id: req.params.clientId }).then(user => {
    if (user) {
      var updatedUser = {};
      updatedUser.name = name;
      updatedUser.email = email;
      updatedUser.userType = userType;
      updatedUser.expiryDate = expiryDate;
      updatedUser.password = password;

      // Create salt and hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
          if (err) throw err;
          updatedUser.password = hash;
          User.updateOne({ _id: req.params.clientId }, updatedUser, function(err, raw) {
            // If there's an error
            if (err) {
              return res.status(400).json({ msg: 'There has been a problem updating the user' });
            } else {
              res.status(200).json({ status: 'ok' });
            }
          });
        });
      });
    } else {
      return res.status(404).json({ msg: 'There was a problem finding the user' });
    }
  });
});

// @route DELETE /deleteclient
// @desc Deletes the client with the specified id
// @access Private
router.delete('/deleteclient/:id', auth, (req, res) => {
  User.deleteOne({ _id: req.params.id }, function(err, client) {
    if (err) {
      return res.status(400).json({ msg: 'There has been a problem deleting the client' });
    } else {
      res.status(200).json(client);
    }
  });
});

// export the router so it can be used elsewhere
module.exports = router;
