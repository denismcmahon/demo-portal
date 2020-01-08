// pull in the required dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema to represent a user, defining fields and types as objects of the schema
const SiteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  folderUuid: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

// export the model so we can access it outside the file
module.exports = Site = mongoose.model('sites', SiteSchema);
