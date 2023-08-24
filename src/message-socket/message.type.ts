export interface MessageRequest {
  fromUser: string;
  toUser: string;
  chatRoomId: string;
  content: string;
}

export interface MessageResponse extends MessageRequest {
  createdAt: number;
}

export interface JoinRoomRequest {
  chatRoomId: string;
}
