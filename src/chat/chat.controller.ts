import { Controller } from '@nestjs/common';
import { Body, Post, Req, UseGuards } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Access } from 'src/auth/access.decorator';
import { AccessGuard } from 'src/auth/access.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatGateway } from './chat.gateway';
import { AdminType, Chat } from './chat.model';
import { ChatService } from './chat.service';
import { UserCreateChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService, private chatGateway: ChatGateway) { }

    //First user create chat ---------------------------------------------------------------------------------------
    @UseGuards(JwtAuthGuard)
    @Post('/createChat')
    async createChat(@Body(new ValidationPipe()) userCreateChatDto: UserCreateChatDto): Promise<Chat> {
        const result = await this.chatService.userCreateChat(userCreateChatDto);
        await this.chatGateway.adminNewChat(result);
        return result;
    }

    //Checking if chat is already exist -----------------------------------------------------------------------------
    @UseGuards(JwtAuthGuard)
    @Post('/getUserChat')
    async getUserChat(@Body() data: {id: string, admin: AdminType}) {
        const result = await this.chatService.getUserChat(data.id)
        // console.log(result)
        if (result && !result.admin && data?.admin) {
            // console.log(1)
            const oper = await this.chatService.addAdminToChat({id: result._id, admin: data.admin})
            // console.log(oper)
        }
        return result;
    }

    @Access([0, 1])
    @UseGuards(AccessGuard)
    @Post('/getAllChats')
    async getAllChats() {
        return this.chatService.getAllChats()
    }
}
