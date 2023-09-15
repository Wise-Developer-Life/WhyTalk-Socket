import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  MQ_JOB_EXCHANGE,
  MQ_MATCHING_EXCHANGE,
} from '../message-queue/message-queue.config';

export const MQConfigurationModule = RabbitMQModule.forRoot(RabbitMQModule, {
  exchanges: [
    {
      name: MQ_JOB_EXCHANGE,
      type: 'direct',
    },
    {
      name: MQ_MATCHING_EXCHANGE,
      type: 'topic',
    },
  ],
  uri: 'amqp://localhost:5672',
});
