import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessageRequest {
  fromUser: string;
  toUser: string;
  roomId: string;
  content: string;
}

@WebSocketGateway()
export class MessageSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`WebSocket client ${client.id} connected.`);
  }

  handleDisconnect(client: Socket) {
    console.log(`WebSocket client ${client.id} disconnected.`);
  }

  @SubscribeMessage('message')
  async receiveMessage(@MessageBody() message: MessageRequest) {
    const { toUser, fromUser } = message;

    const fullMessage = {
      ...message,
      createdAt: Date.now(),
    };

    console.log(`receive message in socket...`, fullMessage);
    this.server.emit(`message-${toUser}`, fullMessage);
    this.server.emit(`message-${fromUser}`, fullMessage);
  }
}
