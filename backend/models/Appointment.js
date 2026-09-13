const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  purpose: String,
  status: { type: String, enum: ["pending","approved","rejected","completed"], default: "pending" }
}, { timestamps: true });
module.exports = mongoose.model("Appointment", schema);
