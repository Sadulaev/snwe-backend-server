import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec()
    }

    async removeUserById(id: string): Promise<User> {
        return this.userModel.findByIdAndRemove(id)
    }

    async removeAllUsers(): Promise<User[]> {
        const users = await this.userModel.find()
        users.forEach(user => {
            this.userModel.findByIdAndRemove(user._id).exec()
        })
        return users;
    }

    async findUserById(id: string): Promise<User[]> {
        return this.userModel.findById(id)
    }

    async findUserByName(nickname: string): Promise<User> {
        return this.userModel.findOne({nickname: nickname});
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email: email})
    }

    async findUserByNumber(number: string): Promise<User> {
        return this.userModel.findOne({number: number})
    }

    async updateUserById(id: string, updateData: object): Promise<User> {
        const user = this.userModel.findById(id).exec()
        return this.userModel.findByIdAndUpdate(id, {...user, ...updateData})
    }
}
