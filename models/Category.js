// pull in the required dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema to represent a user, defining fields and types as objects of the schema
const CategorySchema = new Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

// export the model so we can access it outside the file
module.exports = Category = mongoose.model("categories", CategorySchema);