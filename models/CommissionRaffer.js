const mongoose = require("mongoose")
const {Schema} = mongoose
const Commissionraffer = new Schema({
    country: {type: String},
    rafferid: {type: String},
    date:{type: String},
    lead: {type: String},
    solution:{type:String},
    promices: {type: String},
    payout: {type: String},


}, 
{ timestamps: true }
)
module.exports = mongoose.model("Commissionraffer", Commissionraffer)