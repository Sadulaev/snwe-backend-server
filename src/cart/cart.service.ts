import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.model';
import { CreateCartDto, updateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async createCart(createCartDto: CreateCartDto): Promise<Cart> {
    const result = new this.cartModel(createCartDto);
    return result.save();
  }

  async getCartByUserId(id: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId: id }).exec();
    return cart;
  }

  async updateCartById(updateCartDto: updateCartDto): Promise<Cart> {
    const result = await this.cartModel.findByIdAndUpdate(updateCartDto).exec();
    if (result) {
      throw new HttpException('Данные обновлены', HttpStatus.OK);
    } else {
      console.log(result);
      throw new HttpException('Ошибка обновления данных', HttpStatus.FORBIDDEN);
    }
  }
}
