const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  company: String,
  purpose: String,
  photoUrl: String,
  idNumber: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
module.exports = mongoose.model("Visitor", schema);
