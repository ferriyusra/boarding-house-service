/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardingHouseImage } from '../entities/boarding-house-image.entity';
import { BoardingHouse } from '../entities/boarding-house.entity';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class BoardingHouseImageRepository {
  constructor(
    @InjectRepository(BoardingHouseImage)
    private readonly repository: Repository<BoardingHouseImage>,
  ) { }

  public async findOneByBoardingHouse(uuid: string): Promise<BoardingHouseImage[]> {
    return await this.repository.find({
      where: {
        boardingHouse: {
          uuid: uuid,
        },
      },
      order: {
        id: 'ASC',
      }
    });
  }

  public async create(data: DeepPartial<BoardingHouseImage>): Promise<BoardingHouseImage> {
    const boardingHouseImage = this.repository.create(data);
    return this.repository.save(boardingHouseImage);
  }

  public async delete(boardingHouse: BoardingHouse): Promise<UpdateResult> {
    return await this.repository.softDelete({ boardingHouse });
  }
}
