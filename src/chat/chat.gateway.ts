import { Logger } from "@nestjs/common";
import { Server, Socket } from 'Socket.IO'
import { WebSocketGateway, WebSocketServer, MessageBody, OnGatewayInit, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets'

import { ChatService } from "./chat.service";
import { NewMessageDto } from "./dto/chat.dto";
import { Chat, ChatType } from "./chat.model";


@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayInit {
    constructor(private chatService: ChatService) { }
    private logger: Logger = new Logger('OrderGateway')

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        this.logger.log('Initialized')
    }

    async adminNewChat(chat: Chat) {
        this.server.emit('admin:new-chat', { chat })
    }


    @SubscribeMessage('user:create-chat')
    async userJoinChat(@ConnectedSocket() client: Socket, @MessageBody() payload: { chatId: string }) {
        console.log('user create and join chat')
        client.join(`${payload.chatId}`)
        this.server.emit('admin:new-chat', { chatId: payload.chatId })
    }

    @SubscribeMessage('user:create-message')
    async userNewMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { id: string, message: string }) {
        const now = new Date()
        const message: NewMessageDto = { message: payload.message, from: 'user', timestamp: now }
        try {
            const chat = await this.chatService.newMessage(payload.id, message)
            this.server.to(`${chat._id}`).emit('room:new-message', { message: message })
        } catch (e) {
            console.log(e)
            client.emit('error', { error: 'Ошибка мессенджера' })
        }
    }

    @SubscribeMessage('admin:create-message')
    async adminNewMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { id: string, message: string }) {
        const now = new Date()
        const message: NewMessageDto = { message: payload.message, from: 'admin', timestamp: now }
        try {
            const chat = await this.chatService.newMessage(payload.id, message)
            this.server.to(`${chat._id}`).emit('room:new-message', { message: message })
        } catch (e) {
            console.log(e)
            client.emit('error', { error: 'Ошибка мессенджера' })
        }

    }

    @SubscribeMessage('admin:join-room')
    async adminJoinRoom(@ConnectedSocket() admin: Socket, @MessageBody() payload: string) {
        admin.join(`${payload}`)
        console.log('joined admin')
    }

    @SubscribeMessage('user:join-room')
    async userJoinRoom(@ConnectedSocket() admin: Socket, @MessageBody() payload: string) {
        admin.join(`${payload}`)
        console.log('joined user')
    }

    // @SubscribeMessage('admin:new-message')
    // async adminNewMessage(@ConnectedSocket() client: Socket, @MessageBody() payload) {
    //   this.server.in(payload.id).emit('user:new-message')
    // }
}
