require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Visitor.deleteMany({});
  await Appointment.deleteMany({});
  const password = await bcrypt.hash("Password@123", 10);
  const users = await User.insertMany([
    {name:"Admin User",email:"admin@visitorpass.com",password,role:"admin"},
    {name:"Security Desk",email:"security@visitorpass.com",password,role:"security"},
    {name:"Employee Host",email:"employee@visitorpass.com",password,role:"employee"},
    {name:"Demo Visitor",email:"visitor@example.com",password,role:"visitor"}
  ]);
  const visitor = await Visitor.create({
    name:"Rahul Patil", phone:"9876543210", email:"rahul@example.com",
    company:"ABC Technologies", purpose:"Business Meeting"
  });
  await Appointment.create({
    visitor:visitor._id, host:users[2]._id,
    date:new Date(Date.now()+24*60*60*1000), purpose:"Business Meeting", status:"approved"
  });
  console.log("Demo data created.");
  console.log("Password for all demo users: Password@123");
  await mongoose.disconnect();
}
seed().catch(e=>{console.error(e);process.exit(1);});
