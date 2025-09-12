const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {


// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  // host: "smtp.example.com",
  service: "gmail",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SEND_MAIL_EMAIL,
    pass: process.env.SEND_MAIL_PASSWORD,
  },
});


  const mailOptions = {
    from: process.env.SEND_MAIL_EMAIL,
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent successfully:", info);
  });


}
