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
import {
  JoinRoomRequest,
  MessageRequest,
  MessageResponse,
} from './message.type';
import { UseFilters, UsePipes } from '@nestjs/common';
import { WsExceptionFilter } from './ws-exception-filter';
import { WSValidationPipe } from './ws-validation-pipe';

@UseFilters(WsExceptionFilter)
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

  @UsePipes(WSValidationPipe)
  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() joinRequest: JoinRoomRequest,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('join request: ', joinRequest);
    const { chatRoomId } = joinRequest;

    client.join(chatRoomId);
    if (!this.connectedUsers.has(client.id)) {
      this.connectedUsers.set(client.id, []);
    }

    this.connectedUsers.get(client.id).push(chatRoomId);

    console.log(`${client.id} join room ${chatRoomId}`);

    const clientsInRoom = this.server.sockets.adapter.rooms.get(chatRoomId);
    console.log(`clients in room ${chatRoomId}: `, clientsInRoom);
  }

  @UsePipes(WSValidationPipe)
  @SubscribeMessage('message')
  async receiveMessage(@MessageBody() message: MessageRequest) {
    const { chatRoomId } = message;

    const fullMessage: MessageResponse = {
      ...message,
      createdAt: Date.now(),
    };

    console.log(`receive message in room ${chatRoomId}...`, fullMessage);
    this.server.to(chatRoomId).emit(`message`, fullMessage);

    await this.mqMessageService.saveMessage(fullMessage);
  }
}
