/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardingHouseTestimony } from '../entities/boarding-house-testimony.entity';
import { BoardingHouse } from '../entities/boarding-house.entity';
import { IQueryParams } from '../interfaces/database.interface';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class BoardingHouseTestimonyRepository {
  constructor(
    @InjectRepository(BoardingHouseTestimony)
    private readonly repository: Repository<BoardingHouseTestimony>,
  ) { }

  public async findAllWithPagination(params: IQueryParams): Promise<{
    data: BoardingHouseTestimony[];
    total: number;
  }> {
    const offset: number = (params.page - 1) * params.limit;
    const [data, total] = await this.repository.findAndCount({
      select: {
        id: true,
        uuid: true,
        userId: true,
        rating: true,
        date: true,
        testimonial: true,
        boardingHouse: {
          id: true,
          name: true,
        }
      },
      skip: offset,
      take: params.limit,
      order: { id: 'DESC' },
    });
    return { data, total };
  }

  public async findByOrderId(orderUuid: string): Promise<BoardingHouseTestimony | null> {
    return await this.repository.findOne({
      where: { orderId: orderUuid },
    });
  }

  public async findByUuid(uuid: string): Promise<BoardingHouseTestimony | null> {
    return this.repository.findOne({
      relations: {
        boardingHouse: true,
      },
      where: { uuid: uuid },
    });
  }

  public async findById(id: number): Promise<BoardingHouseTestimony | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  public async create(data: DeepPartial<BoardingHouseTestimony>): Promise<BoardingHouseTestimony> {
    const boardingHouseTestimony = this.repository.create(data);
    return this.repository.save(boardingHouseTestimony);
  }

  public async deleteByBoardingHouse(boardingHouse: BoardingHouse): Promise<UpdateResult> {
    return await this.repository.softDelete({ boardingHouse: boardingHouse });
  }
}
