const mongoose = require("mongoose")
const {Schema} = mongoose
const PartnerSchema = new Schema({
name: {type: String},
email: {type: String, unique: true},
businessName:{type: String},
country: {type: String},
state:{type:String},
city: {type: String},
Businesscate:{type: String},
partnerId:{type: String},
phone:{type: String}

}, 
{ timestamps: true }
)
module.exports = mongoose.model("Partner", PartnerSchema)