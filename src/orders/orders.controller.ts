import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Put, Req, UseGuards, Query } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { skip } from 'rxjs';
import { Access } from 'src/auth/access.decorator';
import { AccessGuard } from 'src/auth/access.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './order.model';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
    constructor(private orderService: OrdersService) { }

    //Order creating-----------------------------------------------------------------------------------------------------
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createOrder(@Req() req, @Body(new ValidationPipe()) createOrderDto: CreateOrderDto): Promise<Order> {
        return await this.orderService.createOrder({ userId: req.user.id, ...createOrderDto })
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

    @Post('/actuals')
    async getActualOrders() {
        const PENDING = await this.orderService.getPendingOrders();
        const INPROGRESS = await this.orderService.getInProgressOrders();
        const SENDED = await this.orderService.getSendedOrders();
        const WAITING = await this.orderService.getUserWaitingOrders();
        const ACCEPTING = await this.orderService.getAcceptingOrders();
        return { PENDING, INPROGRESS, SENDED, WAITING, ACCEPTING }
    }

    @Post('/completed')
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

    // Updating order status...
    @Put('/nextStep')
    async handleNextStep(@Body('orderId') orderId: string) {
        console.log('Order id:', orderId)
        return await this.orderService.handleNextStep(orderId);
    }

    //Get Orders by user Id...
    @Post('/getByUserId/:id')
    async getOrdersByUserId(@Param('id') id: string) {
        return this.orderService.getOrdersByUserId(id)
    }

    //Get Orders by user Id...
    @Post('/getOrdersHistory/:id')
    async getOrdersHistory(@Param('id') id: string) {
        return this.orderService.getOrdersHistory(id)
    }
}
