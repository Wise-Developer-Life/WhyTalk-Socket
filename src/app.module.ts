import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';

import { MessageQueueModule } from './message-queue/message-queue.module';
import { GateWayModule } from './gateway/gateway.module';
import AppConfigModule from './module/config.module';

@Module({
  imports: [GateWayModule, SocketModule, MessageQueueModule, AppConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
