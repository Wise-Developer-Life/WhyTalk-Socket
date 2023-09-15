import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  MQ_MATCHING_COMPLETED_QUEUE,
  MQ_MATCHING_COMPLETED_ROUTING_KEY,
  MQ_MATCHING_EXCHANGE,
} from '../message-queue/message-queue.config';
import { Injectable } from '@nestjs/common';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class MessageQueueGateway {
  constructor(private readonly socketService: SocketService) {}

  //TODO: fix any type, define incoming request type
  @RabbitSubscribe({
    exchange: MQ_MATCHING_EXCHANGE,
    routingKey: MQ_MATCHING_COMPLETED_ROUTING_KEY,
    queue: MQ_MATCHING_COMPLETED_QUEUE,
  })
  matchingCompleteHandler(message: any) {
    console.log('match completed: ', message);

    //TODO: think more detailed logic
    // should we send to both users to make sure they r both online?
    // in my opinion, i think we should cancel match process once a user is offline

    const { user1, user2 } = message;
    this.socketService.publishEventToUsers(
      [user1, user2],
      'match.complete',
      message,
    );
  }
}
