import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/allException.filter';
import { ProductModule } from './modules/products/product.module';
import { UserModule } from './modules/users/user.module';
import { CategoryModule } from './modules/categories/categoies.module';
import { OrderEntity } from './modules/orders/entity/order.entity';
import { ProductEntity } from './modules/products/entity/product.entity';
import { UserEntity } from './modules/users/userEntity/user.entity';
import { CategoryEntity } from './modules/categories/entity/categories.entity';
import { ChatSocketModule } from './modules/chat-socket/chat-socket.module';
import { GoogleModule } from './modules/google/google.module';
import { VnPayTransactionEntity } from './modules/payment/entity/vn_pay_transaction.entity';
import { DiscountEntity } from './modules/discount/discount.entity';
import { InvoiceEntity } from './modules/invoice/invoice.entity';
import { ReviewEntity } from './modules/reviews/review.entity';
import { CartEntity } from './modules/cart/entity/cart.entity';
import { CartItemEntity } from './modules/cart/entity/cart-item.entity';
import { CartModule } from './modules/cart/cart.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderItemEntity } from './modules/orders/entity/order-item.entity';
import { OrderModule } from './modules/orders/order.module';
import { VnPayModule } from './modules/payment/VnPayModule.module';
import { GHNModule } from './modules/GHN/GHN.module';
import { ChatMessageEntity } from './modules/chat-socket/entity/chat-message.entity';
import { ChatRoomEntity } from './modules/chat-socket/entity/chat-room.entity';
import { StatisticModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_NAME'),
        entities: [
          UserEntity,
          ProductEntity,
          CategoryEntity,
          OrderEntity,
          CartEntity,
          CartItemEntity,
          VnPayTransactionEntity,
          // DiscountEntity,
          // InvoiceEntity,
          // ReviewEntity,
          OrderItemEntity,
          ChatMessageEntity,
          ChatRoomEntity,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ChatSocketModule,
    GoogleModule,
    CartModule,
    AuthModule,
    VnPayModule,
    GHNModule,
    ChatSocketModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
