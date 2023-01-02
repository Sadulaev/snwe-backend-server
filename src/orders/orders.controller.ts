import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Put, Req, UseGuards, Query } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { skip } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './order.model';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
    constructor(private orderService: OrdersService) {}

    //Order creating-----------------------------------------------------------------------------------------------------
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createOrder(@Req() req, @Body(new ValidationPipe()) createOrderDto: CreateOrderDto): Promise<Order> {
        return await this.orderService.createOrder({userId: req.user.id, ...createOrderDto})
    }

    //Get orders----------------------------------------------------------------------------------------------------------
    @Get('/all')
    async getAllOrders(
        @Query('skip') skip: string,
        @Query('count') count: string,
        @Query('data') data: string,
        @Query('status') status: string,
        @Query('total') total: string
    ): Promise<Order[]> {
        return await this.orderService.getAllOrders();
    }

    @Get('/actuals')
    async getActualOrders() {
        const pending = await this.orderService.getPendingOrders();
        const inProgress = await this.orderService.getInProgressOrders();
        const sended = await this.orderService.getSendedOrders();
        const waiting = await this.orderService.getUserWaitingOrders();
        const accepting = await this.orderService.getAcceptingOrders();
        return {pending, inProgress, sended, waiting, accepting}
    }

    @Get('/completed')
    async getCompletedOrders(
        @Query('skip') skip,
        @Query('counter') counter
    ) {
        return await this.orderService.getCompletedOrders(+skip, +counter);
    }

    @Get('/failed')
    async getFailedOrders(
        @Query('skip') skip,
        @Query('counter') counter
    ) {
        return await this.orderService.getFailedOrders(+skip, +counter);
    }


    //Updating orders-------------------------------------------------------------------------------------
    @Put('/handleInProgress')
    async handleInProgress(@Param('orderId') orderId: string): Promise<Order> {
        return await this.orderService.handleInProgress(orderId);
    }

    @Put('/handleSend')
    async handleSend(@Param('orderId') orderId: string): Promise<Order> {
        return await this.orderService.handleSend(orderId);
    }

    @Put('/handleComplete')
    async handleComplete(@Param('orderId') orderId: string) {
        return await this.orderService.handleCompleted(orderId)
    }

    @Put('/handleFailed')
    async handleFailed(@Param('orderId') orderId: string): Promise<Order> {
        return await this.orderService.handleFailed(orderId);
    }
}
