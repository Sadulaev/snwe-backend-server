import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from 'src/cart/cart.service';
import { OrderSchema } from './order.model';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema}]),
    CartService
  ]
})
export class OrdersModule {}
