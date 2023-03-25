import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admins/admin.model';
import { AdminsService } from 'src/admins/admins.service';
import { AdminType, Chat, ChatDocument } from './chat.model';
import { NewMessageDto, UserCreateChatDto } from './dto/chat.dto';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) { }

    async userCreateChat(createChatDto: UserCreateChatDto): Promise<Chat> {
        const now = new Date()
        const chat: Chat = {
            user: createChatDto.user,
            messages: [
                { message: createChatDto.message, from: 'user', timestamp: now }
            ]

        }
        try {
            return await new this.chatModel(chat).save()
        } catch (e) {
            console.log(e)
            throw new HttpException('Ошибка мессенджера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getUserChat(id: string): Promise<Chat> {
        console.log(id)
        try {
            const chat = await this.chatModel.findOne({'user.id': id}).exec()
            if(chat) {
                const result = (chat).toObject()
                return ({...result, messages: result.messages.slice(-5)})
            } else {
                return chat;
            }
        } catch(e) {
            console.log(e)
            throw new HttpException("Ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async newMessage(id: string, newMessage: NewMessageDto): Promise<Chat> {
        try {
            return await this.chatModel.findByIdAndUpdate(id, {$push: {messages: newMessage}}).exec()
        } catch (e) {
            console.log(e)
            throw new HttpException('Ошибка мессенджера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllChats(): Promise<Chat[]> {
        try {
            return await this.chatModel.find().select('user e admin e createdAt')
        } catch (e) {
            throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addAdminToChat({id, admin}): Promise<Chat[]> {
        try {
            return await this.chatModel.findByIdAndUpdate(id, {admin: {id: admin.id, name: admin.name}})
        } catch (e) {
            throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
