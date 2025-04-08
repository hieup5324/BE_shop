import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GHNController } from './GHN.controller';
import { GHNService } from './GHN.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GHNController],
  providers: [GHNService],
  exports: [GHNService],
})
export class GHNModule {}
