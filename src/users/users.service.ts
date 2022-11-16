import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let message = {};
    await this.userModel.findOne({ nickname: createUserDto.nickname }).exec() ? message = { nickname: 'Имя пользователя занято' } : false;
    createUserDto.email ? await this.userModel.findOne({ email: createUserDto.email }).exec() ? message = { ...message, email: 'Почтовый ящик уже зарегистрирован на сайте' } : false : false;
    await this.userModel.findOne({ number: createUserDto.number }).exec() ? message = { ...message, number: 'Номер уже зарегистрирован на сайте' } : false;
    if (Object.keys(message).length) {
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    } else {
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async removeUserById(id: string) {
    const result = await this.userModel.findByIdAndRemove(id).exec();
    if (result) {
      throw new HttpException('Пользователь успешно удален', HttpStatus.OK)
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
  }

  // async removeAllUsers(): Promise<User[]> {
  //   const users = await this.userModel.find();
  //   users.forEach((user) => {
  //     this.userModel.findByIdAndRemove(user._id).exec();
  //   });
  //   return users;
  // }

  async findUserById(id: string): Promise<User> {
    const result = await this.userModel.findById(id).exec();
    if (result) {
      return result;
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
  }

  async findUserByName(nickname: string): Promise<User> {
    const result = await this.userModel.findOne({ nickname: nickname }).exec();
    console.log(result)
    if (result) {
      return result;
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }


  async findUserByNumber(number: string): Promise<User> {
    return await this.userModel.findOne({ number: number }).exec();
  }


  async updateUserById(id: string, updateData: EditUserDto) {
    if (updateData.nickname) {
      const isUnique = await this.userModel.findById(id).exec();
      if (isUnique) throw new HttpException('Имя пользователя занято', HttpStatus.BAD_REQUEST)
    }
    const result = this.userModel.findByIdAndUpdate(id, { ...updateData });
    if (result) {
      throw new HttpException('Данные были успешно добавлены', HttpStatus.OK)
    } else {
      throw new HttpException('Смесь не найдена', HttpStatus.NOT_FOUND)
    }
  }
}