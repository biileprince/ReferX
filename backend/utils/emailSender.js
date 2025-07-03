import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class EmailSender {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name || user.email.split('@')[0];
    this.url = url;
    this.from = `ReferralRewards Pro <${process.env.EMAIL_FROM}>`;
  }

  async sendReferralSuccess(referreeName) {
    await this.send('referralSuccess', 'Referral Success!', { referreeName });
  }

  newTransport() {
    // Use SendGrid for production, Mailtrap for development
    
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    }

    // Development transport (Mailtrap)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async send(template, subject, context = {}) {
    try {
      const templatePath = path.join(__dirname, `../views/email/${template}.pug`);
      const html = pug.renderFile(templatePath, {
        name: this.name,
        url: this.url,
        subject,
        ...context
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html)
      };

      const info = await this.newTransport().sendMail(mailOptions);
      console.log(`Email sent to ${this.to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`Email failed to ${this.to}:`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerification() {
    await this.send('verifyEmail', 'Email Verification for ReferralRewards Pro');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Password Reset Request');
  }
}