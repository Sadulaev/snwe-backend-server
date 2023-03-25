import { Controller, Post, UseGuards, Req, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CartService } from './cart.service';
import { CalculatePrice, UpdateCartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/getById')
    async getCartByUserId(@Req() req) {
        const result = await this.cartService.getCartByUserId(req.user.id);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Put('/add')
    async addProductToCart(@Req() req, @Body(new ValidationPipe()) updateCartDto: UpdateCartDto) {
        return await this.cartService.addToCart(req.user.id, updateCartDto)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/remove')
    async removeProductFromCart(@Req() req, @Body(new ValidationPipe()) updateCartDto: UpdateCartDto) {
        return await this.cartService.removeFromCart(req.user.id, updateCartDto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/calculate')
    async calculateCartPrice(@Body() calculatePrice: CalculatePrice) {
        const resultPrice = await this.cartService.calculatePrice(calculatePrice)
        return resultPrice;
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('/clear')
    async clearCart(@Req() req) {
        // console.log(req.user.id)
        return await this.cartService.clearCart(req.user.id)
    }
}