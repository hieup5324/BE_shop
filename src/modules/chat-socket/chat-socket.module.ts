import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSocketGateway } from './chat-socket.gateway';
import { ChatSocketService } from './chat-socket.service';
import { ChatRoomEntity } from './entity/chat-room.entity';
import { ChatMessageEntity } from './entity/chat-message.entity';
import { UserEntity } from '../users/userEntity/user.entity';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatSocketController } from './chat-socket.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoomEntity, ChatMessageEntity, UserEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ChatSocketController],
  providers: [ChatSocketGateway, ChatSocketService],
  exports: [ChatSocketService],
})
export class ChatSocketModule {}
