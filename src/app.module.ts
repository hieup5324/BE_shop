import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/userEntity/user.entity';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/product.entity';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/allException.filter';
import { GroupModule } from './group/group.module';
import { GroupEntity } from './group/group.entity';
import { UserGroupEntity } from './user/userEntity/user-group.entity';
import { CardEntity } from './card/card.entity';
import { CardModule } from './card/card.module';
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
          GroupEntity,
          UserGroupEntity,
          CardEntity,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    GroupModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
