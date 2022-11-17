import { Controller, Post, Body } from '@nestjs/common';
import { LoginAdminDto } from 'src/admins/dto/login-admin.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/admin/signin')
    async adminSignIn(@Body(new ValidationPipe()) loginAdminDto: LoginAdminDto) {
        return this.authService.adminLogin(loginAdminDto)
    }

    @Post('/signup')
    async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.authService.userRegist(createUserDto)
    }

    @Post('/signin')
    async signIn(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
        return this.authService.userLogin(loginUserDto)
    }
}
