import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { Admin, AdminSchema } from './admin.model';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    ProductsModule,
  ],
  exports: [AdminsService],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
