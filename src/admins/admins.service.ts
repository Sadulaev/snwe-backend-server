import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AdminsService {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>, private usersService: UsersService) { }

    async createAdmin(id: string): Promise<Admin> {
        const userById = await this.usersService.findUserById(id)
        const isUnique = await this.adminModel.findOne({ userId: id })
        if (isUnique) {
            throw new HttpException('Этот пользователь уже получил роль администратора', HttpStatus.BAD_REQUEST)
        } else {
            const newAdmin = new CreateAdminDto(userById._id, userById.nickname, userById.password)
            console.log(userById._id)
            return new this.adminModel(newAdmin).save()
        }
    }
    async removeAdmin(id: string) {
        const result = await this.adminModel.findByIdAndRemove(id);
        if (result) {
            throw new HttpException('Пользователь удален', HttpStatus.OK)
        } else {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
    }
    async getAdminById(id: string): Promise<Admin> {
        const result = await this.adminModel.findById(id).exec();
        if (result) {
            return result;
        } else {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
    }
    async getAllAdmins(): Promise<Admin[]> {
        return this.adminModel.find().exec()
    }
}
