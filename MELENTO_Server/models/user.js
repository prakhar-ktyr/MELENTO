const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: [{ type: addressSchema, required: true }], // Embedded array of addresses
  password: { type: String, required: true },
  dob: { type: String, required: true }, // Or consider using Date type
  role: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
