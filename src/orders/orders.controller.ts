import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './order.model';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createOrder(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto): Promise<Order> {
        return await this.orderService.createOrder(createOrderDto)
    }

    @Get('/all')
    async getAllOrders(): Promise<Order[]> {
        return await this.orderService.getAllOrders();
    }

    @Put('/handle')
    async handleOrder(@Param('orderId') orderId: string): Promise<Order> {
        return await this.handleOrder(orderId);
    }

    @Put('/accept')
    async acceptOrder(@Param('orderId') orderId: string): Promise<Order> {
        return await this.acceptOrder(orderId);
    }

    @Put('/reject')
    async rejectOrder(@Param('orderId') orderId: string): Promise<Order> {
        return await this.rejectOrder(orderId);
    }
}
