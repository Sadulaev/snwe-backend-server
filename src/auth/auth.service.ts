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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private usersService: UsersService,
    private adminsService: AdminsService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  //User registration and authorization with helpers (private...)

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

    const hashPassword = await bcrypt.hash(
      userDto.password,
      +process.env.BCRYPT_HASH,
    );
    const activationLink = uuidv4();

    const result = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
      activationLink,
    });

    await this.mailService.sendUserConfirmation(
      { name: userDto.nickname, email: userDto.email },
      activationLink,
    );

    if (result) {
      throw new HttpException('Регистрация прошла успешно', HttpStatus.CREATED);
    } else {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userLogin(loginUserDto: LoginUserDto, rememberUser: boolean) {
    const user = await this.validateUser(loginUserDto);
    const tokens = await this.generateUserTokens(user, rememberUser);
    await this.saveToken(user._id, tokens.refreshToken);
    return { ...tokens, user };
  }

  private async generateUserTokens(user: User, rememberUser: boolean) {
    const payload = {
      id: user._id,
      nickname: user.nickname,
      banned: user.banned,
    };

    const accesToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_KEY,
      expiresIn: '10s',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: rememberUser ? '21d' : '20s',
    });

    return { accesToken, refreshToken };
  }

  private async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.tokenModel.findOne({ userId }).exec();
    if (tokenData) {
      tokenData.token = refreshToken;
      return tokenData.save();
    }
    const token = new this.tokenModel({ userId, token: refreshToken });
    return token.save();
  }

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

  //Activate user account

  async confirmMail(link: string) {
    try {
      return this.usersService.activateUser(link);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //LogOut for Users

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

  //Update refresh token for Users

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Ошибка авторизации', HttpStatus.UNAUTHORIZED);
    }
    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new HttpException('Ошибка авторизации', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.usersService.findUserById(userData.id);
    const tokens = await this.generateUserTokens(user, false);
    await this.saveToken(user._id, tokens.refreshToken);
    console.log(tokens);
    return { ...tokens, user };
  }

  private async validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_KEY,
      });
      return userData;
    } catch (e) {
      console.log(e);
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
      console.log(e);
      return null;
    }
  }

  private async findToken(refreshToken) {
    return await this.tokenModel.findOne({ token: refreshToken }).exec();
  }

  //Admin's services (Admin have no registration function because of only global admin with accessLvl=0 can create another admin)

  async adminLogin(loginAdminDto: LoginAdminDto) {
    const admin = await this.validateAdmin(loginAdminDto);
    return this.generateAdminToken(admin);
  }

  private async generateAdminToken(admin: Admin) {
    const payload = {
      id: admin._id,
      nickname: admin.nickname,
      accessLvl: admin.accessLvl,
    };
    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }

  private async validateAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminsService.getAdminByName(
      loginAdminDto.nickname,
    );
    if (admin.nickname) {
      const checkPassword = await bcrypt.compare(
        loginAdminDto.password,
        admin.password,
      );
      if (checkPassword) {
        return admin;
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
}
