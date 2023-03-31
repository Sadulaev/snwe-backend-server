import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  Headers,
  Redirect,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
    return this.authService.userRegist(createUserDto);
  }

  @Post('/signin')
  async signIn(
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
    @Headers('rememberSession') rememberHeader,
    @Res({ passthrough: true }) response: Response,
  ) {
    const rememberSession = rememberHeader === 'true' ? true : false;
    const tokens = await this.authService.userLogin(loginUserDto, rememberSession);
    const tokenLifeTime = (rememberSession ? 21 : 1) * 24 * 60 * 60 * 1000;
    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: tokenLifeTime,
      httpOnly: true,
    });
    return { accessToken: tokens.accesToken, user: tokens.user };
  }

  @Post('/admin/signin')
  async AdminSignIn(
    @Body(new ValidationPipe()) loginAdminDto: LoginAdminDto,
    @Headers('rememberSession') rememberHeader,
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log(rememberHeader)
    const rememberSession = rememberHeader === 'true' ? true : false;
    const tokens = await this.authService.adminLogin(loginAdminDto, rememberSession)
    const tokenLifeTime = (rememberSession ? 21 : 1) * 24 * 60 * 60 * 1000;
    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: tokenLifeTime,
      httpOnly: true,
    });
    return {accessToken: tokens.accesToken, user: tokens.admin}
  }

  @Get('/mail/confirm/:link')
  @Redirect(process.env.CLIENT_URL, 301)
  async confirmAccount(@Param('link') link: string) {
    return await this.authService.confirmMail(link);
  }

  @Post('/logout')
  // @Redirect(process.env.CLIENT_API, 301)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const token = await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
    return token;
  }

  @Post('/refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const tokens = await this.authService.refresh(refreshToken);
    const rememberSession = await this.authService.checkSession(tokens.refreshToken)
    const tokenLifeTime = (rememberSession ? 21 : 1) * 24 * 60 * 60 * 1000;
    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: tokenLifeTime,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { accessToken: tokens.accesToken, info: tokens.personInfo };
  }
}
