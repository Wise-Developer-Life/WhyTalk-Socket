export interface MessageRequest {
  fromUser: string;
  toUser: string;
  roomId: string;
  content: string;
}

export interface MessageResponse {
  fromUser: string;
  toUser: string;
  roomId: string;
  content: string;
  createdAt: number;
}
