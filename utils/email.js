const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) We need to define Email options
  const mailOptions = {
    from: 'Muhammad Ashfaq <ashfaq441997@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email with node mailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
