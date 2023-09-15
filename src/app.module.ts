import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';

import { MessageQueueModule } from './message-queue/message-queue.module';
import { GateWayModule } from './gateway/gateway.module';

@Module({
  imports: [GateWayModule, SocketModule, MessageQueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
