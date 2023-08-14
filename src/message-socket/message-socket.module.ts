import { Module } from '@nestjs/common';
import { MessageSocketGateway } from './message-socket.gateway';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMqModule],
  providers: [MessageSocketGateway],
})
export class MessageSocketModule {}
