import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageSocketModule } from './message-socket/message-socket.module';

@Module({
  imports: [MessageSocketModule, MessageSocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
