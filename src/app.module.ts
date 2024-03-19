import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/allException.filter';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { CardEntity } from './modules/card/card.entity';
import { CardModule } from './modules/card/card.module';
import { GroupEntity } from './modules/group/group.entity';
import { GroupModule } from './modules/group/group.module';
import { ProductEntity } from './modules/products/entity/product.entity';
import { ProductModule } from './modules/products/product.module';
import { UserModule } from './modules/users/user.module';
import { UserGroupEntity } from './modules/users/userEntity/user-group.entity';
import { UserEntity } from './modules/users/userEntity/user.entity';
import { CategoryEntity } from './modules/categories/entity/categories.entity';
import { CategoryModule } from './modules/categories/categoies.module';

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
          CategoryEntity,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServic: ConfigService) => ({
        redis: {
          host: configServic.get('REDIS_HOST'),
          port: +configServic.get('REDIS_PORT'),
          password: configServic.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    GroupModule,
    CardModule,
    CategoryModule,
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
