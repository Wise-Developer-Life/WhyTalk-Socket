import { Module } from '@nestjs/common';
import { MessageQueueService } from './message-queue.service';
import { MQConfigurationModule } from '../module/rabbit_mq.module';

@Module({
  imports: [MQConfigurationModule],
  providers: [MessageQueueService],
  exports: [MessageQueueService],
})
export class MessageQueueModule {}
