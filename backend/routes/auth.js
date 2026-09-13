const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 10),
      role: ["admin","security","employee","visitor"].includes(role) ? role : "visitor"
    });
    res.status(201).json({ message: "Registered successfully", id: user._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, name: user.name, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;
