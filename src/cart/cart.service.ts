import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mixture } from 'src/products/mixture.model';
import { Nutrition } from 'src/products/nutrition.model';
import { ProductsService } from 'src/products/products.service';
import { Cart, CartDocument } from './cart.model';
import { CalculatePrice, CreateCartDto, UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>, private productsService: ProductsService) { }

  async createCart(createCartDto: CreateCartDto): Promise<Cart> {
    const result = new this.cartModel(createCartDto);
    return result.save();
  }

  async getCartByUserId(id: string) {
    const cart = await this.cartModel.findOne({ userId: id });
    if (cart) {
      let nutritions: Nutrition[] = await Promise.all(cart.nutritions.map(async (nutrition) => {
        const result = await this.productsService.getNutritionById(nutrition)
        return result;
      }));
      let mixtures: Mixture[] = await Promise.all(cart.mixtures.map(async (mixture) => {
        const result = await this.productsService.getMixtureById(mixture)
        return result;
      }));
      return { nutritions, mixtures }
    } else {
      const newCart = await this.createCart({ userId: id })
      return newCart;
    }
  }

  async addToCart(userId: string, updateCartDto: UpdateCartDto) {
    const cart = await this.getOrCreateCart(userId);
    if (updateCartDto.type === 'nutrition' && !cart.nutritions.includes(updateCartDto.productId)) {
      await this.cartModel.updateOne({ userId }, { $push: { nutritions: updateCartDto.productId } })
      const addedProduct = await this.productsService.getNutritionById(updateCartDto.productId)
      return addedProduct;
    } else if (updateCartDto.type === 'mixture' && !cart.nutritions.includes(updateCartDto.productId)) {
      await this.cartModel.updateOne({ userId }, { $push: { mixtures: updateCartDto.productId } })
      const addedProduct = await this.productsService.getMixtureById(updateCartDto.productId)
      return addedProduct
    }
    throw new HttpException('Продукт уже в корзине', HttpStatus.BAD_REQUEST)
  }

  async removeFromCart(userId: string, updateCartDto: UpdateCartDto) {
    const cart = await this.getOrCreateCart(userId);
    if (updateCartDto.type === 'nutrition') {
      await this.cartModel.updateOne({ userId }, { $pull: { nutritions: updateCartDto.productId } })
      throw new HttpException('Продукт удален из корзины', HttpStatus.OK)
    } else if (updateCartDto.type === 'mixture') {
      await this.cartModel.updateOne({ userId }, { $pull: { mixtures: updateCartDto.productId } })
      throw new HttpException('Продукт удален из корзины', HttpStatus.OK)
    }
    throw new HttpException('Неверный тип продукта', HttpStatus.BAD_REQUEST)
  }

  async calculatePrice(calculatePrice: CalculatePrice): Promise<number> {
    let resultPrice: number = 0;
    console.log('calc:', calculatePrice)
    for (const nutrition of calculatePrice.nutritions) {
      const result = await this.productsService.getNutritionById(nutrition._id)
      resultPrice += (result.price * nutrition.count)
    }
    for (const mixture of calculatePrice.mixtures) {
      const result = await this.productsService.getMixtureById(mixture._id)
      if (mixture.count < 4) {
        resultPrice += result.twoWeekPrice;
      } else if (mixture.count >= 4) {
        resultPrice += result.twoMonthPrice;
      }
    }
    return resultPrice;
  }

  // async calculateDiscount(calculatePrice: CalculatePrice): Promise<number> {

  // }

  //helpers

  async getOrCreateCart(id: string) {
    const cart = await this.cartModel.findOne({ userId: id });
    if (cart) {
      return cart;
    } else {
      const newCart = await this.createCart({ userId: id })
      return newCart;
    }
  }

  async clearCart(userId: string) {
    const result = await this.cartModel.updateOne({userId}, {nutritions: [], mixtures: []}).exec()
    console.log(result)
    if(result) {
      throw new HttpException('Корзина успешно очищена', HttpStatus.OK)
    } else {
      throw new HttpException('Ошибка очистки корзины', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
