import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSocketService } from './chat-socket.service';

@WebSocketGateway()
export class ChatSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');
  constructor(private readonly chatsocketService: ChatSocketService) {}

  afterInit(server: any) {
    console.log('Init');
  }

  async handleConnection(client: Socket) {
    this.logger.log(
      client.id,
      'ChatSocketioGateway Connected..............................',
    );
    console.log('Client connected', client.handshake.query);
    const user = await this.chatsocketService.getUserFromToken(client);
  }

  async handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('newMessage')
  onMessage(@MessageBody() data: any) {
    console.log('onMessage', data);
    this.server.emit('onMessage', {
      message: 'Hello from server',
      conten: data,
    });
  }
}
