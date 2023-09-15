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
import {
  JoinRoomRequest,
  MessageRequest,
  MessageResponse,
} from './message.type';
import { UseFilters, UsePipes } from '@nestjs/common';
import { WsExceptionFilter } from './ws-exception-filter';
import { WSValidationPipe } from './ws-validation-pipe';
import { MQ_JOB_SAVE_MESSAGE_ROUTING_KEY } from '../message-queue/message-queue.config';
import { SocketService } from '../socket/socket.service';
import { MessageQueueService } from '../message-queue/message-queue.service';

@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly mqService: MessageQueueService,
  ) {}

  connectedUsers = new Map<string, string[]>();

  // TODO: finish logic
  async verifyJwt(token: string) {
    return {
      userId: token,
    };
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.headers.authorization;
    const { userId } = await this.verifyJwt(token);

    if (!userId) {
      console.error(`connection of user ${userId} not allowed`);
      client.emit('error', {
        errorCode: 403,
        message: 'authentication fail',
      });
      client.disconnect(true);
      return;
    }

    this.socketService.setUserSocket(userId, client);
    console.log(`user ${userId} connect to web socket.`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const roomsOfClient = this.connectedUsers.get(client.id) ?? [];

    roomsOfClient.forEach((roomId) => {
      client.leave(roomId);
    });

    console.log('leave rooms: ', roomsOfClient);
    console.log(`WebSocket client ${client.id} disconnected.`);

    const { userId } = client.data;
    this.socketService.removeUserSocket(userId);
    console.log(`remove user ${userId} socket: ${client.id}`);
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

    await this.mqService.enQueueJob(
      MQ_JOB_SAVE_MESSAGE_ROUTING_KEY,
      fullMessage,
    );
  }
}
