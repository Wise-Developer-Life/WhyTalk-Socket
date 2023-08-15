import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MessageResponse } from '../message-socket/message.type';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject('MESSAGE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async saveMessage(message: MessageResponse) {
    console.log('Publish message: ', message);
    const ret = this.client.emit('save_message', message);
    return await lastValueFrom(ret);
  }
}
