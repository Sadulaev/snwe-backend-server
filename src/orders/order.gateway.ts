import { Logger } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'Socket.IO'
import { ConnectedSocket, SubscribeMessage } from "@nestjs/websockets/decorators";
import { Order } from "./order.model";


@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class OrderGateway implements OnGatewayInit {
    private logger: Logger = new Logger('OrderGateway')

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        this.logger.log('Initialized')
        console.log(server)
    }

    async handleCreateOrder(order: Order) {
        this.server.emit('admin:newOrder', {order})
    }

    async handleUpdateOrder(order: Order) {
        this.server.emit('admin:updateOrder', {order})
    }
}