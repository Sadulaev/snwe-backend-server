import { Controller, Post, Body, Get, Res, Headers } from '@nestjs/common';
import { Response } from 'express';
import { LoginAdminDto } from 'src/admins/dto/login-admin.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/signup')
    async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.authService.userRegist(createUserDto)
    }

    @Post('/signin')
    async signIn(
        @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
        @Headers('memoryUser') memoryUser: string,
        @Res({passthrough: true}) response: Response) {
            const rememberUser: boolean = memoryUser === 'true' ? true : false;
            const tokens = await this.authService.userLogin(loginUserDto, rememberUser)
            const tokenLifeTime = (rememberUser ? 21 : 1) * 24 * 60 * 60 * 1000;
            response.cookie('refreshTokne', tokens.refreshToken, {maxAge: tokenLifeTime, httpOnly: true})
            return tokens
    }

    @Post('/logout')
    async logout() {

    }

    @Get('/email/activate/:link')
    async activateMail() {

    }

    @Get('/number/activate/:link')
    async activateNumber() {

    }

    @Get('/refresh') 
    async refreshToken () {

    }

    @Post('/admin/signin')
    async adminSignIn(@Body(new ValidationPipe()) loginAdminDto: LoginAdminDto) {
        return this.authService.adminLogin(loginAdminDto)
    }
}
