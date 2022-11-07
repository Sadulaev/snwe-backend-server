import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AdminsService {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>, private usersService: UsersService) {}

    async createAdmin(id: string): Promise<Admin> {
        const userById = await this.usersService.findUserById(id)
        const newAdmin = new CreateAdminDto(userById._id, userById.nickname, userById.password)
        console.log(userById._id)
        return new this.adminModel(newAdmin).save()
    }
    async removeAdmin(id: string): Promise<Admin> {
        return this.adminModel.findByIdAndRemove(id);
    }
    async getAdminById(id: string): Promise<Admin> {
        return this.adminModel.findById(id);
    }
    async getAllAdmins(): Promise<Admin[]> {
        return this.adminModel.find().exec()
    }
}
