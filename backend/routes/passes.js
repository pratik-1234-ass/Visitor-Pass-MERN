const router = require("express").Router();
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const Pass = require("../models/Pass");
const Visitor = require("../models/Visitor");
const { auth, roles } = require("../middleware/auth");

function makePassNo() { return "VP-" + Date.now().toString().slice(-8) + Math.floor(Math.random()*90+10); }

router.get("/", auth, async (req,res) => {
  res.json(await Pass.find().populate("visitor", "name email phone company purpose").sort({createdAt:-1}));
});

router.post("/", auth, roles("admin","security","employee"), async (req,res) => {
  try {
    const visitor = await Visitor.findById(req.body.visitor);
    if (!visitor) return res.status(404).json({message:"Visitor not found"});
    const passNumber = makePassNo();
    const validFrom = req.body.validFrom || new Date();
    const validUntil = req.body.validUntil || new Date(Date.now()+24*60*60*1000);
    const qrData = JSON.stringify({ passNumber });
    const pass = await Pass.create({ passNumber, visitor: visitor._id, appointment:req.body.appointment, validFrom, validUntil, qrData });
    const populated = await pass.populate("visitor", "name email phone company purpose");
    res.status(201).json(populated);
  } catch(e) { res.status(400).json({message:e.message}); }
});

router.get("/:id/qr", auth, async (req,res) => {
  const pass = await Pass.findById(req.params.id);
  if (!pass) return res.status(404).json({message:"Pass not found"});
  res.type("png").send(await QRCode.toBuffer(pass.qrData));
});

router.get("/:id/pdf", auth, async (req,res) => {
  const pass = await Pass.findById(req.params.id).populate("visitor");
  if (!pass) return res.status(404).json({message:"Pass not found"});
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${pass.passNumber}.pdf`);
  const doc = new PDFDocument({size:[400,250], margin:20});
  doc.pipe(res);
  doc.fontSize(20).text("VISITOR PASS", {align:"center"});
  doc.moveDown();
  doc.fontSize(12).text(`Pass No: ${pass.passNumber}`);
  doc.text(`Visitor: ${pass.visitor.name}`);
  doc.text(`Phone: ${pass.visitor.phone || "-"}`);
  doc.text(`Purpose: ${pass.visitor.purpose || "-"}`);
  doc.text(`Valid Until: ${new Date(pass.validUntil).toLocaleString()}`);
  const qr = await QRCode.toDataURL(pass.qrData);
  doc.moveDown();
  doc.fontSize(10).text("Present this pass at the security desk.");
  doc.end();
});

module.exports = router;
