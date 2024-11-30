/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'false', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'false',
      },
    });
  }
  


  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Email',
      text: `Verification Link: ${verificationLink}`,
    };

    await this.transporter.sendMail(mailOptions);


    console.log(`Verification Link: ${verificationLink}`);
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const resetPasswordLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Password',
      text: `Reset Password Link: ${resetPasswordLink}`,
    };

    await this.transporter.sendMail(mailOptions);

    console.log(`Reset Password Link: ${resetPasswordLink}`);
  }
}
