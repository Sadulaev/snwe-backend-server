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
    return await this.userModel.findOne({ nickname: nickname }).exec();
  }
  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }


  async findUserByNumber(number: string): Promise<User> {
    return await this.userModel.findOne({ number: number }).exec();
  }


  async updateUserById(id: string, updateData: EditUserDto) {
    const isUniqueName = updateData.nickname ? await this.isUniqueName(updateData.nickname) : null;
    const isUniqueEmail = updateData.email ? await this.isUniqueEmail(updateData.email) : null;
    const isUniqueNumber = updateData.number ? await this.isUniqueNumber(updateData.number) : null;

    console.log(isUniqueName, isUniqueEmail, isUniqueNumber)
    if(isUniqueName && isUniqueEmail && isUniqueNumber) {
      const result = this.userModel.findByIdAndUpdate(id, { ...updateData });
      if (result) {
        throw new HttpException('Данные были успешно добавлены', HttpStatus.OK)
      } else {
        throw new HttpException('Ошибка обновления данных', HttpStatus.BAD_REQUEST)
      }
    } else {
      throw new HttpException('Ошибка обновления данных', HttpStatus.BAD_REQUEST)
    }
  }

  async isUniqueName(nickname: string) {
    const result = await this.userModel.find({nickname}).exec()
    return !result;
  }

  async isUniqueEmail(email: string) {
    const result = await this.userModel.find({email}).exec()
    return !result;
  }

  async isUniqueNumber(number: string) {
    const result = await this.userModel.find({number}).exec()
    return !result;
  }
}