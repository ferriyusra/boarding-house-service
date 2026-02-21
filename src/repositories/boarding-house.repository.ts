/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardingHouse } from 'src/entities/boarding-house.entity';
import { IQueryParams, ISearchParams } from 'src/interfaces/database.interface';
import {
  DeepPartial,
  FindOptionsWhere,
  ILike,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class BoardingHouseRepository {
  constructor(
    @InjectRepository(BoardingHouse)
    private readonly repository: Repository<BoardingHouse>,
  ) { }

  private buildWhereClause(search?: string): FindOptionsWhere<BoardingHouse>[] {
    const whereClause: FindOptionsWhere<BoardingHouse>[] = [];
    if (search) {
      const value = `%${search}%`;
      whereClause.push({ name: ILike(value) });
    }

    return whereClause;
  }

  public async findAllWithPagination(params: IQueryParams): Promise<{
    data: BoardingHouse[];
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
        name: true,
        city: {
          name: true,
        },
        type: {
          name: true,
        },
      },
      relations: {
        city: true,
        type: true,
      },
      where: whereClause,
      skip: offset,
      take: params.limit,
      order: { name: 'ASC' },
    });
    return { data, total };
  }

  public async findAllWithoutpagination(): Promise<BoardingHouse[]> {
    return await this.repository.find({
      relations: {
        boardingHouseImages: true,
      },
      order: { name: 'DESC' },
    });
  }

  public async findByUuid(uuid: string): Promise<BoardingHouse | null> {
    return this.repository.findOne({
      relations: {
        boardingHouseImages: true,
        city: true,
        type: true,
        boardingHouseTestimonies: true,
        boardingHouseRooms: true,
        boardingHouseFacilities: true,
        boardingHouseRules: true,
      },
      where: { uuid: uuid },
      order: {
        id: 'DESC',
        boardingHouseRooms: {
          id: 'ASC',
        },
      },
    });
  }

  public async findAll(
    limit: number,
    isPopular: boolean = false,
  ): Promise<BoardingHouse[]> {
    return this.repository.find({
      relations: {
        boardingHouseImages: true,
        boardingHouseRooms: true,
        city: true,
        type: true,
      },
      where: isPopular ? { isPopular: isPopular } : {},
      order: {
        id: 'DESC',
        boardingHouseRooms: {
          id: 'ASC',
        },
      },
      take: limit,
    });
  }

  public async findByTypeOrCity(
    typeUuid?: string,
    cityUuid?: string,
  ): Promise<BoardingHouse[]> {
    let where: FindOptionsWhere<BoardingHouse> | undefined;
    if (typeUuid) {
      where = {
        type: {
          uuid: typeUuid,
        },
      };
    } else if (cityUuid) {
      where = {
        city: {
          uuid: cityUuid,
        },
      };
    } else {
      return [];
    }

    return this.repository.find({
      relations: {
        boardingHouseImages: true,
        boardingHouseRooms: true,
        city: true,
        type: true,
      },
      where,
      order: {
        id: 'DESC',
        boardingHouseRooms: {
          id: 'ASC',
        },
      },
    });
  }

  public async findWithSearch(params: ISearchParams): Promise<BoardingHouse[]> {
    const whereClause: FindOptionsWhere<BoardingHouse> = {};

    if (params.search) {
      whereClause.name = ILike(`%${params.search}%`);
    }

    if (params.city_uuid) {
      whereClause.city = {
        uuid: params.city_uuid,
      };
    }

    if (params.type_uuid) {
      whereClause.type = {
        uuid: params.type_uuid,
      };
    }

    return this.repository.find({
      relations: {
        boardingHouseImages: true,
        boardingHouseRooms: true,
        city: true,
        type: true,
      },
      where: whereClause,
      order: {
        id: 'DESC',
        boardingHouseRooms: {
          id: 'ASC',
        },
      },
    });
  }

  public async count(): Promise<number> {
    return this.repository.count();
  }

  public async findById(id: number): Promise<BoardingHouse | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  public async create(
    data: DeepPartial<BoardingHouse>,
  ): Promise<BoardingHouse> {
    const boardingHouse = this.repository.create(data);
    return this.repository.save(boardingHouse);
  }

  public async update(
    uuid: string,
    data: DeepPartial<BoardingHouse>,
  ): Promise<UpdateResult> {
    return this.repository.update({ uuid }, data);
  }

  public async delete(uuid: string): Promise<UpdateResult> {
    return await this.repository.softDelete({ uuid });
  }
}
