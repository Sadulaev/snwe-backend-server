import { Controller, Param, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { Admin } from './admin.model';
import { AdminsService } from './admins.service';
import { AccessGuard } from 'src/auth/access.guard';
import { Access } from 'src/auth/access.decorator';

@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService, private productsService: ProductsService) { }

    @Access([0])
    @UseGuards(AccessGuard)
    @Post('/create/:id')
    async createAdmin(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.createAdmin(id)
    }

    @Access([0])
    @UseGuards(AccessGuard)
    @Delete('/removeAdmin/:id')
    async removeAdmin(@Param('id') id: string) {
        return this.adminsService.removeAdmin(id)
    }

    @Access([0, 1])
    @UseGuards(AccessGuard)
    @Get('/getAdminById/:id')
    async getAdminById(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.getAdminById(id)
    }

    @Access([0])
    @UseGuards(AccessGuard)
    @Get('/getAllAdmins')
    async getAllAdmins(): Promise<Admin[]> {
        return this.adminsService.getAllAdmins()
    }
}
