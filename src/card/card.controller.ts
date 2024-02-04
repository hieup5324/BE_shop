import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { currentUser } from 'src/user/decorators/currentUser.decorator';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCardDto } from './cardDTO/createCard.dto';
import { UpdateCardDto } from './cardDTO/updateCard.dto';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('card')
@UseGuards(AuthGuard)
export class CardController {
  constructor(private cardService: CardService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  createCard(
    @Body() requestBody: CreateCardDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.cardService.createCard(requestBody, currentUser);
  }

  @Get('/:id')
  getCardById(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.findCardById(id);
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  getAll() {
    return this.cardService.findAll();
  }

  @Put('/update/:id')
  updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateCardDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.cardService.updateCard(id, requestBody, currentUser);
  }

  @Delete('/delete/:id')
  deleteCard(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.cardService.deleteCard(id, currentUser);
  }
}
