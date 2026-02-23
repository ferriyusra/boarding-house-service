/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardingHouseRule } from '../entities/boarding-house-rule.entity';
import { BoardingHouse } from '../entities/boarding-house.entity';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class BoardingHouseRuleRepository {
  constructor(
    @InjectRepository(BoardingHouseRule)
    private readonly repository: Repository<BoardingHouseRule>,
  ) { }

  public async findAllByBoardingHouse(uuid: string): Promise<BoardingHouseRule[]> {
    return await this.repository.find({
      where: {
        boardingHouse: {
          uuid: uuid,
        },
      }
    });
  }

  public async findOne(uuid: string): Promise<BoardingHouseRule | null> {
    return this.repository.findOne({
      where: { uuid: uuid },
    });
  }

  public async create(data: DeepPartial<BoardingHouseRule>): Promise<BoardingHouseRule> {
    const boardingHouseRule = this.repository.create(data);
    return this.repository.save(boardingHouseRule);
  }

  public async deleteByUuid(uuid: string): Promise<UpdateResult> {
    return await this.repository.softDelete({ uuid });
  }

  public async deleteByBoardingHouse(boardingHouse: BoardingHouse): Promise<UpdateResult> {
    return await this.repository.softDelete({ boardingHouse });
  }
}
