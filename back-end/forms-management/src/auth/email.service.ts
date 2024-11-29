/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
    console.log(`Verification Link: ${verificationLink}`);
  }
}
