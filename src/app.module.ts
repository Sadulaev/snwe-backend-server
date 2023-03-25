import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { MailModule } from './mail/mail.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';

//files
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    UsersModule,
    AdminsModule,
    AuthModule,
    ProductsModule,
    CartModule,
    MailModule,
    OrdersModule,
    ChatModule,
    FilesModule,
  ],
})
export class AppModule {}
