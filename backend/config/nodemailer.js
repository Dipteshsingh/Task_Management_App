import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASSWORD
  }
})
const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email failed:", error.message);
  }
};

export default sendMail;