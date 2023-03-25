import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.model';
import { AuthModule } from 'src/auth/auth.module';
import { CartModule } from 'src/cart/cart.module';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  providers: [UsersService, UsersGateway],
  controllers: [UsersController],
})
export class UsersModule {}
