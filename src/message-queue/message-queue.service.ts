import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MQ_JOB_EXCHANGE } from './message-queue.config';

@Injectable()
export class MessageQueueService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async enQueueJob<T>(job: string, payload: T) {
    await this.amqpConnection.publish(MQ_JOB_EXCHANGE, job, payload);
  }

  async publishToExchange<T>(exchange: string, routingKey: string, payload: T) {
    await this.amqpConnection.publish(exchange, routingKey, payload);
  }
}
