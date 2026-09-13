# Visitor Pass Management System (MERN)

A college-assignment-ready Visitor Pass Management System built with MongoDB, Express, React and Node.js.

## Features
- JWT authentication and role-based access
- Admin, Security/Frontdesk, Employee/Host and Visitor roles
- Visitor registration with photo URL
- Appointment/invitation creation and approval
- QR-code visitor pass
- PDF badge download
- Check-in / Check-out using pass number
- Email notification configuration
- Dashboard and visitor search/filter
- CSV report export
- Demo seed data

## Requirements
- Node.js 18+
- MongoDB Atlas or local MongoDB

## 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm start
```
Backend runs on `http://localhost:5000`.

## 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Demo accounts
Password for all demo users: `Password@123`

- Admin: admin@visitorpass.com
- Security: security@visitorpass.com
- Employee: employee@visitorpass.com
- Visitor: visitor@example.com

## MongoDB
Put your MongoDB connection string in `backend/.env`:
`MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/visitor_pass_db`

## Assignment mapping
Authentication -> JWT
Visitor registration -> Visitors
Appointments -> Appointments
Pass issuance -> Passes + QR + PDF
Check-in/out -> CheckLogs
Dashboard/reports -> Dashboard + CSV export
Notifications -> optional SMTP email configuration
