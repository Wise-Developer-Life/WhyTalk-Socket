import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  MQ_JOB_EXCHANGE,
  MQ_MATCHING_EXCHANGE,
} from '../message-queue/message-queue.config';
import { ConfigService } from '@nestjs/config';

export const MQConfigurationModule = RabbitMQModule.forRootAsync(
  RabbitMQModule,
  {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
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
      uri: configService.get<string>('RABBIT_MQ_URL'),
    }),
  },
);
