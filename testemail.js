import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
  from: `"CivilizationX" <${process.env.GMAIL_USER}>`,
  to: 'yourpersonalemail@gmail.com',
  subject: 'Test Email from CivilizationX',
  text: 'This is a test email to check SMTP setup.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Failed to send test email:', error);
  } else {
    console.log('Test email sent:', info.response);
  }
});


