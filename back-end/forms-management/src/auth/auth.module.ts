/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from './email.module';
import { JwtStrategy } from './jwt.strategy';
import * as fs from 'fs';
import * as path from 'path';

const keysPath = path.resolve(process.cwd(), 'keys');

@Module({
  imports: [
    UserModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: fs.readFileSync(path.join(keysPath, 'private.pem')),
      publicKey: fs.readFileSync(path.join(keysPath, 'public.pem')),
      signOptions: {
        expiresIn: '1d',
        algorithm: 'RS256',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
