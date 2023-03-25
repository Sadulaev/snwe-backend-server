import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './chat.model';
import { AdminsModule } from 'src/admins/admins.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema}]),
    AdminsModule,
    AuthModule,
  ]
})
export class ChatModule {}
