const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin","security","employee","visitor"], default: "visitor" }
}, { timestamps: true });
module.exports = mongoose.model("User", schema);
