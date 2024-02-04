import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCardDto } from './cardDTO/createCard.dto';
import { UpdateCardDto } from './cardDTO/updateCard.dto';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { Permission } from 'src/user/checkPermission.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(CardEntity) private cardRepo: Repository<CardEntity>,
  ) {}
  async createCard(requestBody: CreateCardDto, currentUser: UserEntity) {
    const checkCard = await this.cardRepo.findOne({
      where: { user_id: currentUser.id },
    });

    if (checkCard) {
      throw new NotFoundException('User already has a card');
    }
    const card = this.cardRepo.create(requestBody);
    card.user = currentUser;
    return this.cardRepo.save(card);
  }

  findAll() {
    return this.cardRepo.find();
  }

  async findCardById(id: number) {
    const card = await this.cardRepo.findOneBy({ id });
    if (!card) {
      throw new NotFoundException('card not found');
    }
    return card;
  }

  async findOneByOption(option: FindOptionsWhere<any>) {
    const card = await this.cardRepo.findOneBy(option);
    return card;
  }

  async updateCard(
    id: number,
    requestBody: UpdateCardDto,
    currentUser: UserEntity,
  ) {
    let card = await this.findCardById(id);
    if (!card) {
      throw new NotFoundException('card not exsits');
    }
    Permission.check(card.user_id, currentUser);
    card = { ...card, ...requestBody };

    return this.cardRepo.save(card);
  }

  async deleteCard(id: number, currentUser: UserEntity) {
    let card = await this.findCardById(id);

    if (!card) {
      throw new NotFoundException('không có card này');
    }
    Permission.check(card.user_id, currentUser);
    return {
      msg: 'delete successful',
      card,
    };
  }
}
