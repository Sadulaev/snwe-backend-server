import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { EditUserDto } from './dto/edit-user.dto';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcryptjs';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(count:number, page:number) {
    const skipFrom = (page - 1) * count;
    console.log(skipFrom) 
    const users = await this.userModel.find().skip(skipFrom).limit(count)
    const pages = Math.ceil((await this.userModel.countDocuments()) / count)
    return {users, pages}
  }

  async findUserById(id: string): Promise<User> {
    const result = await this.userModel.findById(id).exec();
    if (result) {
      return result;
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
  }

  async findUserByName(nickname: string): Promise<User> {
    return await this.userModel.findOne({ nickname }).exec();
  }
  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserByNumber(number: string): Promise<User> {
    return await this.userModel.findOne({ number }).exec();
  }

  async updateUserName(id: string, nickname: string) {
    const isUniqueName = await this.findUserByName(nickname);
    if (isUniqueName) {
      throw new HttpException(
        'Имя пользователя занято',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.userModel.findByIdAndUpdate(id, { nickname });
    } catch (e) {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException(
      'Имя пользователя было успешно обновлено',
      HttpStatus.OK,
    );
  }

  async updateUserEmail(id: string, email: string) {
    const isUniqueEmail = await this.findUserByEmail(email);
    if (isUniqueEmail) {
      throw new HttpException(
        'Пользотель с такой почтой уже зарегистрироован',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.userModel.findByIdAndUpdate(id, { email, isActivated: false });
    } catch (e) {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException(
      'Почта пользователя была успешно обновлена',
      HttpStatus.OK,
    );
  }

  async updateUserNumber(id: string, number: string) {
    const isUniqueNumber = await this.findUserByName(number);
    if (isUniqueNumber) {
      throw new HttpException('Номер телефона занят.', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.userModel.findByIdAndUpdate(id, { number });
    } catch (e) {
      throw new HttpException(
        'Ошибка на стороне сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException(
      'Номер пользователя был успешно обновлен',
      HttpStatus.OK,
    );
  }

  async updateUserPassword(
    id: string,
    password: string,
    previousPassword: string,
  ) {
    const user = await this.findUserById(id);

    if (user) {
      const checkPassword = await bcrypt.compare(
        previousPassword,
        user.password,
      );

      if (checkPassword) {
        const hashPassword = await bcrypt.hash(
          password,
          +process.env.BCRYPT_HASH,
        );

        try {
          await this.userModel.findByIdAndUpdate(id, {
            password: hashPassword,
          });
        } catch (e) {
          throw new HttpException(
            'Ошибка на стороне сервера',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        throw new HttpException('Пароль успешно обновлен', HttpStatus.OK);
      } else {
        throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
    }
  }

  //Activate user profile
  async activateUser(link: string) {
    const user = await this.userModel.findOne({ activationLink: link }).exec();
    if (user) {
      await this.userModel.findByIdAndUpdate(user._id, { isActivated: true });
      throw new HttpException('Почта была успешно подтверждена', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ошибка подтверждения почтового адреса',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Now user online
  async onlineUser(id: string, socketId: string) {
    try {
      const result = await this.userModel.findByIdAndUpdate(id, {
        socketId
      })
      return result;
    } catch (e) {
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //Now user offline
  async offlineUser(socketId: string) {
    try {
      const result = await this.userModel.updateOne({ socketId }, {
        socketId: null
      })
      return result;
    } catch (e) {
      console.log(e)
      return null;
      // throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //Get online users
  async getOnlineUsers() {
    const onlineUsers = await this.userModel.find({ socketId: { $ne: null } }).count()
    if(onlineUsers) {
      console.log(onlineUsers);
      return {onlineUsers};
    } else {
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}