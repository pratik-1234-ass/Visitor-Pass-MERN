const router = require("express").Router();
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");
const Pass = require("../models/Pass");
const CheckLog = require("../models/CheckLog");
const { auth } = require("../middleware/auth");

router.get("/stats", auth, async (req,res) => {
  const [visitors, appointments, passes, checkins] = await Promise.all([
    Visitor.countDocuments(), Appointment.countDocuments(), Pass.countDocuments(), CheckLog.countDocuments({action:"check-in"})
  ]);
  res.json({ visitors, appointments, passes, checkins });
});
module.exports = router;
