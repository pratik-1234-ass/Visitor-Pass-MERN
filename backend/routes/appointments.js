const router = require("express").Router();
const Appointment = require("../models/Appointment");
const { auth, roles } = require("../middleware/auth");
const sendEmail = require("../utils/email");

router.get("/", auth, async (req,res) => {
  const appointments = await Appointment.find().populate("visitor host", "name email").sort({date:-1});
  res.json(appointments);
});

router.post("/", auth, roles("admin","employee"), async (req,res) => {
  try {
    const ap = await Appointment.create({ ...req.body, host: req.user.id });
    const visitor = await require("../models/Visitor").findById(req.body.visitor);
    if (visitor?.email) await sendEmail(visitor.email, "Visitor Appointment Created", `Your appointment is scheduled for ${req.body.date}.`);
    res.status(201).json(ap);
  } catch(e) { res.status(400).json({message:e.message}); }
});

router.patch("/:id/status", auth, roles("admin","employee"), async (req,res) => {
  const ap = await Appointment.findByIdAndUpdate(req.params.id, {status:req.body.status}, {new:true}).populate("visitor");
  if (!ap) return res.status(404).json({message:"Appointment not found"});
  if (ap.visitor?.email) await sendEmail(ap.visitor.email, `Appointment ${req.body.status}`, `Your appointment status is ${req.body.status}.`);
  res.json(ap);
});
module.exports = router;
