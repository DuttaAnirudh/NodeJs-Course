const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Anirudh Dutta <hello@dutta.io>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SEND GRID
      return 1;
    }

    return nodemailer.createTransport({
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
  }

  // Send the actual email
  async send(template, subject) {
    // 1. Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2. Define EMAIL options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3. Use transport and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
