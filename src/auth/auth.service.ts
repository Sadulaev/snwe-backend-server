import { Injectable } from '@nestjs/common';
import { Admin } from 'src/admins/admin.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AdminsService } from 'src/admins/admins.service';
import { LoginAdminDto } from 'src/admins/dto/login-admin.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './token.model';
import { MailService } from 'src/mail/mail.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private usersService: UsersService,
    private adminsService: AdminsService,
    private jwtService: JwtService,
    private mailService: MailService,
    private cartService: CartService,
  ) { }

  //User and Admin registration and authorization with helpers (private...)


  //User registration-----------------------------------------------------------------------------
  async userRegist(userDto: CreateUserDto) {
    const message = [];
    (await this.usersService.findUserByName(userDto.nickname)) &&
      message.push('Имя пользователя занято');
    (await this.usersService.findUserByEmail(userDto.email)) &&
      message.push('Почтовый ящик уже зарегистрирован на сайте');
    (await this.usersService.findUserByNumber(userDto.number)) &&
      message.push('Номер уже зарегистрирован на сайте');
    if (message.length) {
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    //Password hashing before save into DB
    const hashPassword = await bcrypt.hash(
      userDto.password,
      +process.env.BCRYPT_HASH,
    );
    const activationLink = uuidv4();

    //Creating user using function from users.service.ts
    const result = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
      activationLink,
    });

    //Sending email to activate account
    await this.mailService.sendUserConfirmation(
      { name: userDto.nickname, email: userDto.email },
      activationLink,
    );

    //Special function from cart.service.ts which return cart if exist, or create if not
    await this.cartService.getCartByUserId(result._id)

    if (result) {
      throw new HttpException('Регистрация прошла успешно', HttpStatus.CREATED);
    } else {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //User login function---------------------------------------------------------------------------------------------------
  async userLogin(loginUserDto: LoginUserDto, rememberSession: boolean) {
    const user = await this.validateUser(loginUserDto);
    const payload = {
      id: user._id,
      nickname: user.nickname,
      banned: user.banned,
    };
    const tokens = await this.generateTokens(payload, rememberSession);
    await this.saveToken(user._id, tokens.refreshToken, rememberSession);
    return { ...tokens, user };
  }

  //Admin login function====================================================================================================
  async adminLogin(loginAdminDto: LoginAdminDto, rememberSession: boolean) {
    const admin = await this.validateAdmin(loginAdminDto);
    const payload = {
      id: admin._id,
      nickname: admin.nickname,
      accessLvl: admin.accessLvl,
    };
    const tokens = await this.generateTokens(payload, rememberSession)
    await this.saveToken(admin._id, tokens.refreshToken, rememberSession)
    return { ...tokens, admin };
  }

  //Generate tokens for users and admins accessToken ~ 1h / refreshToken ~ 1d or 21d------------------------------------------------
  private async generateTokens(payload: Object, rememberSession: boolean) {
    const accesToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_KEY,
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: rememberSession ? '21d' : '1d',
    });

    return { accesToken, refreshToken };
  }

  // Saving token into DB for users and admins---------------------------------------------------------------------------------
  private async saveToken(personId: string, refreshToken: string, rememberSession: boolean) {
    const tokenData = await this.tokenModel.findOne({ personId }).exec();
    if (tokenData) {
      tokenData.token = refreshToken;
      tokenData.rememberSession = rememberSession;
      return tokenData.save();
    }
    const token = new this.tokenModel({ personId, token: refreshToken, rememberSession });
    return token.save();
  }

  //User validation------------------------------------------------------------------------------------------------------------
  private async validateUser(loginUserDto: LoginUserDto) {
    const email = await this.usersService.findUserByEmail(loginUserDto.login);
    const nickname = await this.usersService.findUserByName(loginUserDto.login);
    const user = email || nickname;
    if (user) {
      const checkPassword = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (checkPassword) {
        return user;
      }
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Admin validation-------------------------------------------------------------------------------------
  private async validateAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminsService.getAdminByName(
      loginAdminDto.login,
    );
    if (admin) {
      const checkPassword = await bcrypt.compare(
        loginAdminDto.password,
        admin.password,
      );
      if (checkPassword) {
        return admin;
      } else {
        throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST);
    }
  }

  //Activate user account--------------------------------------------------------------------------------------
  async confirmMail(link: string) {
    try {
      return this.usersService.activateUser(link);
    } catch (e) {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //LogOut for Users and Admins-------------------------------------------------------------------------------------
  async logout(token: string) {
    try {
      const result = await this.tokenModel.deleteOne({ token }).exec();
      return result;
    } catch (e) {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Update refresh token for Users and Admins---------------------------------------------------------------------------------------
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Ошибка авторизации (Отсутствует refresh)', HttpStatus.UNAUTHORIZED);
    }
    const personData = this.validateRefreshToken(refreshToken);
    const tokenFromDb: any = await this.findToken(refreshToken);
    if (!personData || !tokenFromDb) {
      throw new HttpException('Ошибка авторизации (некорректыный refresh или не найден токе)', HttpStatus.UNAUTHORIZED);
    }

    let personInfo: Admin | User
    let person: {id: string, nickname: string, accessLvl?: number, banned?: boolean}
    if (personData.hasOwnProperty('accessLvl')) {
      personInfo = await this.adminsService.findAdminById(personData.id)
      person = {
        id: personInfo._id,
        nickname: personInfo.nickname,
        accessLvl: personInfo.accessLvl,
      }
    } else {
      personInfo = await this.usersService.findUserById(personData.id);
      person = {
        id: personInfo._id,
        nickname: personInfo.nickname,
        banned: personInfo.banned,
      };
    }

    const tokens = await this.generateTokens(person, tokenFromDb.rememberSession);

    await this.saveToken(person.id, tokens.refreshToken, tokenFromDb.rememberSession);
    return { ...tokens, personInfo };
  }

  private async validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_KEY,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  private validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_KEY,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  private async findToken(refreshToken) {
    try {
      return await this.tokenModel.findOne({ token: refreshToken }).exec();
    } catch (e) {
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async checkSession(token: string) {
    const userData = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_KEY,
    });
    const result: Token = await this.tokenModel.findOne({ personId: userData.id }).exec()
    return result.rememberSession;
  }
}
