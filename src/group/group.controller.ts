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
import { GroupService } from './group.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateGroupDto } from './groupDTO/createGroup.dto';
import { UpdateGroupDto } from './groupDTO/updateGroup.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

@Controller('group')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  createGroup(@Body() requestBody: CreateGroupDto) {
    return this.groupService.createGroup(requestBody);
  }

  @Get('/:id')
  getGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findGroupById(id);
  }

  @Get()
  getAll() {
    return this.groupService.findAll();
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(id, requestBody);
  }

  @Delete('/delete/:id')
  deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.deleteGroup(id);
  }
}
