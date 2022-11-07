import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersModule } from 'src/users/users.module';
import { Admin, AdminSchema } from './admin.model';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    UsersModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
