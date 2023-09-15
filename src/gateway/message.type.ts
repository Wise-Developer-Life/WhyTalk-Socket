import { IsNotEmpty } from 'class-validator';

export class JoinRoomRequest {
  @IsNotEmpty()
  chatRoomId: string;
}

export class MessageRequest {
  @IsNotEmpty()
  fromUser: string;
  @IsNotEmpty()
  toUser: string;
  @IsNotEmpty()
  chatRoomId: string;
  @IsNotEmpty()
  content: string;
}

export class MessageResponse extends MessageRequest {
  @IsNotEmpty()
  createdAt: number;
}
