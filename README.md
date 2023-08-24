## Why Talk Web Socket Service
This repository is used to design a web socket service for the why talk project. The service is used to send messages between users, and to send messages to the client through the web socket. The mesasge will be dispatched to other services to be saved.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage

```javascript
// join chat room
// before join, please query chat room id from message service
socket.emit('join', { chatRoomId: 'chat_room_id' });

// send message
socket.emit('message', {
  fromUser: 'user1_id',
  toUser: 'user2_id',
  chatRoomId: 'chat_room_id',
  content: 'hello',
});

//recieve message
socket.on('message', (data) => {
  // recieve message if in the same room
});
```
