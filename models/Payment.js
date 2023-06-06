const mongoose = require('mongoose');

const Paymentschema = new mongoose.Schema({
  // Other fixed fields
  // ...

  payment: {
    type: mongoose.Schema.Types.Mixed,
   
  }
});

module.exports = mongoose.model("Payment", Paymentschema)