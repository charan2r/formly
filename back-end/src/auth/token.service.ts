/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';

export class TokenService {
  static generateVerificationToken() {
    const verificationToken = uuidv4();
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    return { verificationToken, verificationTokenExpires };
  }
}
