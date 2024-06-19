import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export class ChatSocketService {
  constructor(private jwtService: JwtService) {}

  async getUserFromToken(client: Socket) {
    // const token: any = client?.handshake?.query?.token;
    // try {
    //   const user = await this.jwtService.verify(token);
    //   return user;
    // } catch (error) {
    //   console.log('error', error);
    // }
  }
}
