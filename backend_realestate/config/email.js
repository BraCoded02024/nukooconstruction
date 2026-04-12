const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Initializing email transporter with user:', process.env.EMAIL_USER);
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('WARNING: Email credentials missing in .env file. Email replies will not work.');
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
