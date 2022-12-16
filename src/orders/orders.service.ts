import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/order.dto';
import { Order, OrderDocument } from './order.model';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, private cartService: CartService) {}
    
    async createOrder(createOrderFromCartDto: CreateOrderDto): Promise<Order> {
        if(!createOrderFromCartDto.nutritions.length && !createOrderFromCartDto.mixtures.length && !createOrderFromCartDto.trainPlans.length) {
            throw new HttpException('Заказ не может быть пустым', HttpStatus.BAD_REQUEST)
        }
        //Вычисление цены
        createOrderFromCartDto.price = await this.cartService.calculatePrice({nutritions: createOrderFromCartDto.nutritions, mixtures: createOrderFromCartDto.mixtures})
        console.log(createOrderFromCartDto)
        const result = new this.orderModel(createOrderFromCartDto).save()
        if(!result) {
            throw new HttpException('Ошибка создания заказа. Пожалуйста попрубуйте позже', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result;
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderModel.find({isClosed: false}).exec()
    }

    async handleOrderById(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else if(!order.isDelivery) {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'Приходите. Заберите'})
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'Заказ в пути.'})
        }
    }

    async acceptOrderById(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'Заказ успешно завершен', isClosed: true, closeDate: new Date()})
        }
    }

    async rejectOrderById(orderId: string) {
        const order: Order = await this.orderModel.findOne({_id: orderId, isClosed: false})
        if(!order) {
            throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
        } else {
            return await this.orderModel.findByIdAndUpdate(orderId, {status: 'Заказ отклонен', isClosed: true, closeDate: new Date()})
        }
    }
}
