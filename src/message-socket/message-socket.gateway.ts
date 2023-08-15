import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RabbitMqService } from '../rabbit-mq/rabbit-mq.service';
import { MessageRequest, MessageResponse } from './message.type';

@WebSocketGateway()
export class MessageSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly mqMessageService: RabbitMqService) {}

  connectedUsers = new Map<string, string[]>();

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`WebSocket client ${client.id} connected.`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const roomsOfClient = this.connectedUsers.get(client.id) ?? [];

    roomsOfClient.forEach((roomId) => {
      client.leave(roomId);
    });

    console.log('leave rooms: ', roomsOfClient);
    console.log(`WebSocket client ${client.id} disconnected.`);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    if (!this.connectedUsers.has(client.id)) {
      this.connectedUsers.set(client.id, []);
    }

    this.connectedUsers.get(client.id).push(roomId);

    console.log(`${client.id} join room ${roomId}`);

    const clientsInRoom = this.server.sockets.adapter.rooms.get(roomId);
    console.log(`clients in room ${roomId}: `, clientsInRoom);
  }

  @SubscribeMessage('message')
  async receiveMessage(@MessageBody() message: MessageRequest) {
    const { roomId } = message;

    const fullMessage: MessageResponse = {
      ...message,
      createdAt: Date.now(),
    };

    console.log(`receive message in room ${roomId}...`, fullMessage);
    this.server.to(roomId).emit(`message`, fullMessage);

    await this.mqMessageService.saveMessage(fullMessage);
  }
}
