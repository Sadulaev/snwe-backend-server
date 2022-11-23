import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsModule } from 'src/admins/admins.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token, TokenSchema } from './token.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    forwardRef(() => UsersModule),
    AdminsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
    exports: [
      AuthService,
      JwtModule,
    ]
})
export class AuthModule {}
