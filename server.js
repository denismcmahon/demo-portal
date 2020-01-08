// pull in the required dependancies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// initialize our app using express
const app = express();

app.use(cors());

app.use(express.json());

// pull in our MongoURI from our keys.js file and connect to our MongoDB database
const db = process.env.MONGO_URL;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB successfully connected to: ' + db))
  .catch(err => console.log(err));

// Routes
app.use('/api/sites', require('./routes/api/sites'));
app.use('/api/clients', require('./routes/api/clients'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/mails', require('./routes/api/mails'));

app.use(express.static(__dirname + '/client/build'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// set the port for our server to run on, anbd have our app listen on that port
// process.env.port is Heroku's port if you choose to deploy the app there
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
