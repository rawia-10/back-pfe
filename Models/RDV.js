const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// create a schema for Dish
let RDVSchema = new Schema({
    Id: String,
    nom :String,
    prenom :String,
    heure:String,
    date: Date,
    tel:Number,
    // PsyId: String,
    // PassId: String,
    email: String,
    Type: String,
    // message:String,
    State: Boolean,
    CreatedAt: Date,
    UpdatedAt: Date
});

// Create a model using schema
let RDV = mongoose.model("RDV", RDVSchema);

// make this model available
module.exports = RDV;