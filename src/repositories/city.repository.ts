/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities/city.entity';
import { IQueryParams } from 'src/interfaces/database.interface';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(City)
    private readonly repository: Repository<City>,
  ) { }

  public async findAllWithPagination(params: IQueryParams): Promise<{
    data: City[];
    total: number;
  }> {
    const offset: number = (params.page - 1) * params.limit;
    const [data, total] = await this.repository.findAndCount({
      select: {
        id: true,
        uuid: true,
        name: true,
        photo: true,
        numberOfUnit: true,
      },
      skip: offset,
      take: params.limit,
      order: { id: 'DESC' },
    });
    return { data, total };
  }

  public async findAllWithoutpagination(): Promise<City[]> {
    return await this.repository.find({
      select: {
        id: true,
        uuid: true,
        name: true,
        photo: true,
        numberOfUnit: true,
      },
      order: { id: 'DESC' },
    });
  }

  public async findByUuid(uuid: string): Promise<City | null> {
    return this.repository.findOne({
      where: { uuid: uuid },
    });
  }

  public async findById(id: number): Promise<City | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  public async create(data: DeepPartial<City>): Promise<City> {
    const city = this.repository.create(data);
    return this.repository.save(city);
  }

  public async update(
    uuid: string,
    data: DeepPartial<City>,
  ): Promise<UpdateResult> {
    return this.repository.update({ uuid }, data);
  }

  public async delete(uuid: string): Promise<UpdateResult> {
    return await this.repository.softDelete({ uuid });
  }
}
