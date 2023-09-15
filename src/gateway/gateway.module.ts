import { MessageQueueService } from '../message-queue/message-queue.service';
import { SocketService } from '../socket/socket.service';
import { SocketModule } from '@nestjs/websockets/socket-module';
import { MessageQueueModule } from '../message-queue/message-queue.module';
import { Module } from '@nestjs/common';
import { MQConfigurationModule } from '../module/rabbit_mq.module';
import { SocketGateway } from './socket.gateway';
import { MessageQueueGateway } from './message-queue.gateway';

@Module({
  imports: [SocketModule, MessageQueueModule, MQConfigurationModule],
  providers: [
    MessageQueueGateway,
    SocketGateway,
    SocketService,
    MessageQueueService,
  ],
})
export class GateWayModule {}
