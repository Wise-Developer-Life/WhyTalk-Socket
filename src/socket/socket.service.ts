import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  constructor() {}

  connectedUserSockets = new Map<string, Socket>();

  setUserSocket(user: string, socket: Socket) {
    if (!user) {
      return;
    }
    this.connectedUserSockets.set(user, socket);
  }

  removeUserSocket(user: string) {
    this.connectedUserSockets.delete(user);
  }

  publishEventToUsers<T>(users: string | string[], event: string, message: T) {
    if (!users) {
      throw Error('User is null or undefined');
    }

    if (!Array.isArray(users)) {
      users = [users];
    }

    const sockets = this.getSocketsFromUsers(users);
    sockets.forEach((socket) => socket.emit(event, message));
  }

  private getSocketsFromUsers(users: string[]) {
    const connectedUsers = users.filter((user) =>
      this.connectedUserSockets.has(user),
    );
    return connectedUsers.map((user) => this.connectedUserSockets.get(user));
  }
}
