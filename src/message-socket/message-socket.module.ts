import { Module } from '@nestjs/common';
import { MessageSocketGateway } from './message-socket.gateway';

@Module({
  imports: [],
  providers: [MessageSocketGateway],
})
export class MessageSocketModule {}
