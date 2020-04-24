const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// create a schema for Dish
let UserSchema = new Schema({
    Id: String,
    nom: String,
    prenom: String,
    address: String,
    email: String,
    date_naissance:Date,
    password: String,
    tel: String,
    IsActive: Boolean,
    Role: String,
    genre:String,
    
    specialite:String,
    fix:String,
    atitude_professionelle:String,
    image:String,
    assurance_maladie:String,
    horaire_travail:String,
    CreatedAt: Date,
    UpdatedAt: Date



});

// Create a model using schema
let User = mongoose.model("User", UserSchema);

// make this model available
module.exports = User;