import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './cart.model';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }])],
})
export class CartModule {}
