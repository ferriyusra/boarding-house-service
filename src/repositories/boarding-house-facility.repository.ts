/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardingHouseFacility } from '../entities/boarding-house-facility.entity';
import { BoardingHouse } from '../entities/boarding-house.entity';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class BoardingHouseFacilityRepository {
  constructor(
    @InjectRepository(BoardingHouseFacility)
    private readonly repository: Repository<BoardingHouseFacility>,
  ) { }

  public async findAllByBoardingHouse(uuid: string): Promise<BoardingHouseFacility[]> {
    return await this.repository.find({
      where: {
        boardingHouse: {
          uuid: uuid,
        },
      }
    });
  }

  public async findOne(uuid: string): Promise<BoardingHouseFacility | null> {
    return this.repository.findOne({
      where: { uuid: uuid },
    });
  }

  public async create(data: DeepPartial<BoardingHouseFacility>): Promise<BoardingHouseFacility> {
    const boardingHouseFacility = this.repository.create(data);
    return this.repository.save(boardingHouseFacility);
  }

  public async deleteByUuid(uuid: string): Promise<UpdateResult> {
    return await this.repository.softDelete({ uuid });
  }

  public async deleteByBoardingHouse(boardingHouse: BoardingHouse): Promise<UpdateResult> {
    return await this.repository.softDelete({ boardingHouse });
  }
}
