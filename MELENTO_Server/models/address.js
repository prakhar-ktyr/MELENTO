const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  houseNo: { type: Number, required: true },
  street: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
