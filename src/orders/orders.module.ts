import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CartModule } from 'src/cart/cart.module';
import { OrderGateway } from './order.gateway';
import { OrderSchema } from './order.model';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderGateway],
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema}]),
    CartModule,
    AuthModule,
  ]
})
export class OrdersModule {}
