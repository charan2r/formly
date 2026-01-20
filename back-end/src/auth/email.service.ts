/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true', 
      },
    });
    
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP Configuration Error:', error);
      } else {
        console.log('SMTP Connection Successful');
      }
    });
    
  }
  


  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://localhost:5173/auth/verify-email?token=${token}`;

    const htmlTemplate = `
    <div style="background-color: #f9f9f9; padding: 40px;">
      <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 32px; text-align: center; width: 390px; margin: 0 auto;">
        <!-- Title -->
        <div style="margin-bottom: 24px; margin-top: 16px;">
          <h2 style="font-size: 24px; font-weight: bold; margin: 0;">
            Form.M
          </h2>
        </div>

        <!-- Message Section -->
        <div style="text-align: left; margin-bottom: 24px;">
          <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">
            Welcome to our Form.M
          </h3>
          <p style="margin-top: 8px; font-size: 14px; color: #555; line-height: 1.5;">
            Thank you for joining us! We're excited to have you on board and
            look forward to working together. To proceed, please click below
            link to set a password.
          </p>
        </div>

        <!-- Button -->
        <a href="${verificationLink}" 
           style="display: inline-block; background-color: black; color: white; font-weight: bold; text-decoration: none; border-radius: 40px; padding: 12px 0; width: 100%; text-align: center; margin: 20px 0;">
          Reset Password
        </a>

        <!-- Footer Section -->
        <div style="text-align: left; margin-top: 24px;">
          <p style="font-size: 13px; color: #777; margin-bottom: 12px;">
            If you have any questions, feel free to contact our support team.
          </p>
          <p style="font-size: 13px; color: #777; margin-top: 8px;">
            Thank you, <br />
            <strong>Team Form.M</strong>
          </p>
        </div>
      </div>
    </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to Form.M - Verify Your Email',
      html: htmlTemplate,
      // Include a text version for email clients that don't support HTML
      text: `Welcome to Form.M! Please verify your email by clicking this link: ${verificationLink}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to: ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const resetPasswordLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

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
