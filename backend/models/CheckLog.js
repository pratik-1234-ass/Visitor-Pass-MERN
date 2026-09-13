const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  pass: { type: mongoose.Schema.Types.ObjectId, ref: "Pass", required: true },
  action: { type: String, enum: ["check-in","check-out"], required: true },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model("CheckLog", schema);
