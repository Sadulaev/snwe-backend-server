import { Logger } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { SubscribeMessage } from "@nestjs/websockets/decorators";
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
    }

    async handleCreateOrder(order: Order) {
        this.server.emit('admin:new-order', {order})
    }

    async handleUpdateOrder(order: Order) {
        this.server.emit('admin:update-order', {order})
    }
}
