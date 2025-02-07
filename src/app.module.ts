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
import { OrderModule } from './modules/orders/order.module';
import { OrderEntity } from './modules/orders/entity/order.entity';
import { ProductEntity } from './modules/products/entity/product.entity';
import { UserEntity } from './modules/users/userEntity/user.entity';
import { CategoryEntity } from './modules/categories/entity/categories.entity';
import { OrdersProductsEntity } from './modules/orders/entity/order-product.entity';
import { ShippingEntity } from './modules/orders/entity/shipping.entity';
import { ChatSocketModule } from './modules/chat-socket/chat-socket.module';
import { GoogleModule } from './modules/google/google.module';

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
          OrdersProductsEntity,
          ShippingEntity,
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
