import { Controller, Param, Delete, Get, Post } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { Admin } from './admin.model';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService, private usersService: UsersService, private productsService: ProductsService) {}

    @Post('/create/:id')
    async createAdmin(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.createAdmin(id)
    }

    @Delete('/removeAdmin/:id')
    async removeAdmin(@Param('id') id: string) {
        return this.adminsService.removeAdmin(id)
    }

    @Get('/getAdminById/:id')
    async getAdminById(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.getAdminById(id)
    }

    @Get('/getAllAdmins')
    async getAllAdmins(): Promise<Admin[]> {
        return this.adminsService.getAllAdmins()
    }

    @Post('/getUsers')
    async getUsers(): Promise<User[]> {
        return await this.usersService.findAll()
    }

    // @Post('/getMixtures')
    // async getProducts() {
    //     const products = {mixtures: [], nutritions: [], categories: []}
    //     products.mixtures = await this.productsService.getAllMixtures()
    //     products.nutritions = await
    // }
}
