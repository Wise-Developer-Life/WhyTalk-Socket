import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageSocketModule } from './message-socket/message-socket.module';

import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [MessageSocketModule, RabbitMqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
