const router = require("express").Router();
const CheckLog = require("../models/CheckLog");
const Pass = require("../models/Pass");
const { auth, roles } = require("../middleware/auth");

router.get("/", auth, async (req,res) => {
  res.json(await CheckLog.find().populate({path:"pass",populate:{path:"visitor",select:"name phone"}}).sort({timestamp:-1}));
});

router.post("/scan", auth, roles("admin","security"), async (req,res) => {
  const pass = await Pass.findOne({passNumber:req.body.passNumber}).populate("visitor");
  if (!pass) return res.status(404).json({message:"Invalid pass number"});
  if (pass.status !== "active") return res.status(400).json({message:"Pass is not active"});
  if (new Date(pass.validUntil) < new Date()) return res.status(400).json({message:"Pass has expired"});
  const last = await CheckLog.findOne({pass:pass._id}).sort({timestamp:-1});
  const action = last?.action === "check-in" ? "check-out" : "check-in";
  const log = await CheckLog.create({pass:pass._id, action, scannedBy:req.user.id});
  res.json({message:`${action} successful`, action, visitor:pass.visitor, log});
});
module.exports = router;
