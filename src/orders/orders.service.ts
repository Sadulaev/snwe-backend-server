import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/order.dto';
import { OrderGateway } from './order.gateway';
import { Order, OrderDocument } from './order.model';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, private cartService: CartService, private orderGateway: OrderGateway) {}
    
    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        if(!createOrderDto.nutritions.length && !createOrderDto.mixtures.length && !createOrderDto.trainPlans.length) {
            throw new HttpException('Заказ не может быть пустым', HttpStatus.BAD_REQUEST)
        }
        //Вычисление цены
        createOrderDto.total = await this.cartService.calculatePrice({nutritions: createOrderDto.nutritions, mixtures: createOrderDto.mixtures})
        console.log(createOrderDto.total)
        const result = await new this.orderModel(createOrderDto).save()
        if(!result) {
            throw new HttpException('Ошибка создания заказа. Пожалуйста попрубуйте позже', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        this.orderGateway.handleCreateOrder(result)
        throw new HttpException('Заказ был оформлен. За статусом заказа вы можете следить в личном кабинете', HttpStatus.CREATED)
    }

    //Orders get functions-------------------------------------------------------------------------------------------------------------------------------------------------
    async getAllOrders(): Promise<Order[]> {
        return await this.orderModel.find({isClosed: false}).exec()
    }

    async getPendingOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "PENDING"}).exec()
    }

    async getInProgressOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "IN PROGRESS"}).exec()
    }

    async getSendedOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "IN THE WAY"}).exec()
    }

    async getUserWaitingOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "WAITING"}).exec()
    }

    async getAcceptingOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "ACCEPTING"}).exec()
    }

    async getCompletedOrders(skip: number, counter: number) {
        const count = (await this.orderModel.find({status: "COMPLETED"}).exec()).length;
        const result = await this.orderModel.find({status: "COMPLETED"}).skip(skip).limit(counter)
        const currentCount = skip + counter;
        return {result, isMore: currentCount <= count}
    }

    async getFailedOrders(skip: number, counter: number) {
        const count = (await this.orderModel.find({status: "FAILED"}).exec()).length;
        const result = await this.orderModel.find({status: "FAILED"}).skip(skip).limit(counter)
        const currentCount = skip + counter;
        return {result, isMore: currentCount <= count}
    }


    //Order each step status----------------------------------------------------------------------------------------------------------------------------------------------
    async handleInProgress(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'IN PROGRESS'})
        }
    }

    async handleSend(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else if(!order.isDelivery) {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'WAITING'})
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'IN THE WAY'})
        }
    }

    async handleCompleted(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'COMPLETED', isClosed: true, closeDate: new Date()})
        }
    }

    async handleFailed(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'FAILED', isClosed: true, closeDate: new Date()})
        }
    }
}
