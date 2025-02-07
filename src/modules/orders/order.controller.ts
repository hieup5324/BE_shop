import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { currentUser } from '../shared/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './orderDTO/createOrder.dto';
import { OrderEntity } from './entity/order.entity';
import { UpdateOrderStatusDto } from './orderDTO/updateOrder-status.dto';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() requestBody: CreateOrderDto,
    @currentUser() currentUser: UserEntity,
  ): Promise<OrderEntity> {
    return await this.orderService.create(requestBody, currentUser);
  }

  @Get()
  getAllOrder(): Promise<OrderEntity[]> {
    return this.orderService.getAll();
  }

  @Get('/:id')
  async getOrderId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderEntity> {
    return await this.orderService.findOne(id);
  }

  @Put('/update/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateOrderStatusDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return await this.orderService.updateById(id, requestBody, currentUser);
  }

  @Put('/cancel/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async cancelled(
    @Param('id') id: string,
    @currentUser() currentUser: UserEntity,
  ) {
    return await this.orderService.cancelled(+id, currentUser);
  }

  @Delete('/delete/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
