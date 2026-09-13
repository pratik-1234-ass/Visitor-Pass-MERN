const router = require("express").Router();
const Visitor = require("../models/Visitor");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req,res) => {
  const q = req.query.q || "";
  const visitors = await Visitor.find({ $or: [
    { name: { $regex: q, $options: "i" } },
    { email: { $regex: q, $options: "i" } },
    { phone: { $regex: q, $options: "i" } }
  ] }).sort({ createdAt: -1 });
  res.json(visitors);
});

router.post("/", auth, async (req,res) => {
  try {
    const visitor = await Visitor.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(visitor);
  } catch(e) { res.status(400).json({message:e.message}); }
});
module.exports = router;
