import { Logger } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'Socket.IO'
import { ConnectedSocket, SubscribeMessage } from "@nestjs/websockets/decorators";
import { UsersService } from "./users.service";

interface mongoId {
  id: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class UsersGateway implements OnGatewayInit {
  constructor(private usersService: UsersService) { }
  private logger: Logger = new Logger('OrderGateway')

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized')
  }

  handleDisconnect(client: Socket) {
    const rooms = Object.keys(client.rooms);
    rooms.forEach(room => {
      if (room !== client.id) {
        client.leave(room);
      }
    })
    this.usersService.offlineUser(client.id);
  }

  @SubscribeMessage('user:connect')
  handleUserOnline(client: Socket, payload: mongoId) {
    this.usersService.onlineUser(payload.id, client.id)
  }
}