const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  passNumber: { type: String, unique: true, required: true },
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  validFrom: Date,
  validUntil: Date,
  qrData: String,
  status: { type: String, enum: ["active","used","expired","cancelled"], default: "active" }
}, { timestamps: true });
module.exports = mongoose.model("Pass", schema);
