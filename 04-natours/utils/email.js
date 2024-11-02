const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a Transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail', // (a service which would actually send the email like gmail)
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      // Activate in gmail "less secure app" option
      // NOTE: Gmail is not a good idea for a production app
      // GOOD OPIONS: "SendGrid" && "MailGun"
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: 'Anirudh Dutta <hello@dutta.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
