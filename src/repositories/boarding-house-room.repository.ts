/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardingHouseRoom, RoomStatus } from 'src/entities/boarding-house-room.entity';
import { BoardingHouse } from 'src/entities/boarding-house.entity';
import { IQueryParams, ISearchParams } from 'src/interfaces/database.interface';
import {
  DeepPartial,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  QueryRunner,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class BoardingHouseRoomRepository {
  constructor(
    @InjectRepository(BoardingHouseRoom)
    private readonly repository: Repository<BoardingHouseRoom>,
  ) { }

  private async generateRoomCode(): Promise<string> {
    const lastRoom = await this.repository.findOne({
      select: {
        code: true,
      },
      where: { code: Not(IsNull()) },
      order: { code: "DESC" },
    });

    let newCodeNumber = 1;
    if (lastRoom?.code) {
      const regex = /^RM-(\d{4})$/;
      const match = lastRoom.code.match(regex);
      if (match) {
        newCodeNumber = parseInt(match[1], 10);
        newCodeNumber += 1;
      }
    }

    return `RM-${newCodeNumber.toString().padStart(4, '0')}`;
  }

  private buildWhereClause(search?: string): FindOptionsWhere<BoardingHouseRoom>[] {
    const whereClause: FindOptionsWhere<BoardingHouseRoom>[] = [];
    if (search) {
      const value = `%${search}%`;
      whereClause.push({ name: ILike(value) });
    }

    return whereClause;
  }

  public async findAllWithPagination(params: IQueryParams): Promise<{
    data: BoardingHouseRoom[];
    total: number;
  }> {
    const offset: number = (params.page - 1) * params.limit;
    const whereClause = params.query
      ? this.buildWhereClause(params.query)
      : undefined;
    const [data, total] = await this.repository.findAndCount({
      select: {
        id: true,
        uuid: true,
        code: true,
        name: true,
        capacity: true,
        size: true,
        photo: true,
        pricePerMonth: true,
        status: true,
        boardingHouse: {
          name: true,
        }
      },
      relations: {
        boardingHouse: true,
      },
      where: whereClause,
      skip: offset,
      take: params.limit,
      order: { name: 'ASC' },
    });
    return { data, total };
  }

  public async findAllWithoutpagination(): Promise<BoardingHouseRoom[]> {
    return await this.repository.find({
      select: {
        id: true,
        uuid: true,
        name: true,
      },
      order: { name: 'DESC' },
    });
  }

  public async findOne(uuid: string): Promise<BoardingHouseRoom | null> {
    return this.repository.findOne({
      relations: {
        boardingHouse: {
          boardingHouseImages: true,
          city: true,
          type: true,
        }
      },
      where: { uuid: uuid },
    });
  }

  public async countRoomByBoardingHouse(
    boardingHouse: BoardingHouse,
  ): Promise<number> {
    return await this.repository.count({
      where: {
        boardingHouse: boardingHouse,
      }
    })
  }

  public async findLastFiveRoom(): Promise<BoardingHouseRoom[]> {
    return this.repository.find({
      relations: {
        boardingHouse: true,
      },
      take: 5,
      order: {
        id: 'DESC',
      },
    });
  }

  public async findByBoardingHouseUuid(uuid: string): Promise<BoardingHouseRoom[]> {
    return this.repository.find({
      where: {
        boardingHouse: {
          uuid: uuid
        },
        status: RoomStatus.AVAILABLE
      },
    });
  }

  public async count(): Promise<number> {
    return this.repository.count();
  }

  public async create(
    data: DeepPartial<BoardingHouseRoom>,
  ): Promise<BoardingHouseRoom> {
    const boardingHouseRoom = this.repository.create(data);
    return this.repository.save(boardingHouseRoom);
  }

  public async update(
    uuid: string,
    data: DeepPartial<BoardingHouse>,
  ): Promise<UpdateResult> {
    return this.repository.update({ uuid }, data);
  }

  public async updateWithTransaction(
    uuid: string,
    data: DeepPartial<BoardingHouse>,
    queryRunner: QueryRunner,
  ): Promise<UpdateResult> {
    return queryRunner.manager.update(BoardingHouseRoom, { uuid }, data);
  }


  public async deleteByUuid(uuid: string): Promise<UpdateResult> {
    return await this.repository.softDelete({ uuid });
  }

  public async deleteByBoardingHouse(boardingHouse: BoardingHouse): Promise<UpdateResult> {
    return await this.repository.softDelete({ boardingHouse });
  }
}
