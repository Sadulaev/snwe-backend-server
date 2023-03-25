import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/order.dto';
import { OrderGateway } from './order.gateway';
import { Order, OrderDocument } from './order.model';

type orderStatus = 'PENDING' | 'INPROGRESS' | 'WAITING' | 'INTHEWAY'
const deliveryStatusSteps = ['PENDING', 'INPROGRESS', 'INTHEWAY', 'COMPLETED']
const noDeliveryStatusSteps = ['PENDING', 'INPROGRESS', 'SENDED', 'WAITING', 'COMPLETED']

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, private cartService: CartService, private orderGateway: OrderGateway) {}
    
    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        if(!createOrderDto.nutritions.length && !createOrderDto.mixtures.length && !createOrderDto.trainPlans.length) {
            throw new HttpException('Заказ не может быть пустым', HttpStatus.BAD_REQUEST)
        }
        //Вычисление цены
        createOrderDto.total = await this.cartService.calculatePrice({nutritions: createOrderDto.nutritions, mixtures: createOrderDto.mixtures})
        const result = await new this.orderModel(createOrderDto).save()
        if(!result) {
            throw new HttpException('Ошибка создания заказа. Пожалуйста попрубуйте позже', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        this.orderGateway.handleCreateOrder(result)
        this.cartService.clearCart(createOrderDto.userId)
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
        return await this.orderModel.find({status: "INPROGRESS"}).exec()
    }

    async getSendedOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "INTHEWAY"}).exec()
    }

    async getUserWaitingOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "WAITING"}).exec()
    }

    async getAcceptingOrders(): Promise<Order[]> {
        return await this.orderModel.find({status: "ACCEPTING"}).exec()
    }

    async getCompletedOrders(skip: number, counter: number) {
        const count = (await this.orderModel.find({status: "COMPLETED"}).exec()).length;
        const orders = await this.orderModel.find({status: "COMPLETED"}).skip(skip).limit(counter)
        const currentCount = skip + counter;
        return {orders, isMore: currentCount <= count}
    }

    async getFailedOrders(skip: number, counter: number) {
        const count = (await this.orderModel.find({status: "FAILED"}).exec()).length;
        const orders = await this.orderModel.find({status: "FAILED"}).skip(skip).limit(counter)
        const currentCount = skip + counter;
        return {orders, isMore: currentCount <= count}
    }

    //Order status updating...
    async handleNextStep(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        console.log(order)
        const updatedInfo: Object = {
            status: order.isDelivery ? deliveryStatusSteps[deliveryStatusSteps.indexOf(order.status) + 1] : noDeliveryStatusSteps[noDeliveryStatusSteps.indexOf(order.status) + 1],
            isClosed: order.status === 'INTHEWAY' || order.status === 'WAITING' ? true : false,
            closeDate: new Date(),
        }
        console.log(updatedInfo)
        if(!order) {
            throw new HttpException('Заказ не найден или уже обработан другим админом', HttpStatus.NOT_FOUND)
        } else if(order.isClosed === true) {
            throw new HttpException('Заказ был завершен ' + order.closeDate, HttpStatus.NOT_FOUND)
        } else {
            const updatedOrder = await this.orderModel.findByIdAndUpdate(orderId, updatedInfo)
            if(!updatedOrder) {
                throw new HttpException('Ошибка обновления заказа', HttpStatus.INTERNAL_SERVER_ERROR)
            } else {
                this.orderGateway.handleUpdateOrder(updatedOrder)
                throw new HttpException('Заказ был обновлен', HttpStatus.OK)
            }
        }
    }

    //Get orders by user id...
    async getOrdersByUserId(userId: string) {
        const orders: Order[] = await this.orderModel.find({userId, isClosed: false})
        console.log(orders)
        if(orders) {
            return orders
        } else {
            throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Get orders by user id...
    async getOrdersHistory(userId: string) {
        const orders: Order[] = await this.orderModel.find({userId, isClosed: true})
        console.log(orders)
        if(orders) {
            return orders
        } else {
            throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
