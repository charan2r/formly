/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from './email.module';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import * as fs from 'fs';
import * as path from 'path';

const keysPath = path.resolve(process.cwd(), 'keys');

@Module({
  imports: [
    UserModule,
    EmailModule,
    PassportModule,
    JwtModule.register({
      privateKey: fs.readFileSync(path.join(keysPath, 'private.pem')),
      publicKey: fs.readFileSync(path.join(keysPath, 'public.pem')),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '24h'
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
