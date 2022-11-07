import { Controller, Param, Delete, Get, Post } from '@nestjs/common';
import { Admin } from './admin.model';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Post('/create/:id')
    async createAdmin(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.createAdmin(id)
    }

    @Delete('/remove/:id')
    async removeAdmin(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.removeAdmin(id)
    }

    @Get('/getById/:id')
    async getAdminById(@Param('id') id: string): Promise<Admin> {
        return this.adminsService.getAdminById(id)
    }

    @Get('/getAll')
    async getAllAdmins(): Promise<Admin[]> {
        return this.adminsService.getAllAdmins()
    }
}
