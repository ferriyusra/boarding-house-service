/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '../entities/type.entity';
import { IQueryParams } from '../interfaces/database.interface';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class TypeRepository {
  constructor(
    @InjectRepository(Type)
    private readonly repository: Repository<Type>,
  ) { }

  public async findAllWithPagination(params: IQueryParams): Promise<{
    data: Type[];
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

  public async findAllWithoutPagination(): Promise<Type[]> {
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

  public async findByUuid(uuid: string): Promise<Type | null> {
    return this.repository.findOne({
      where: { uuid: uuid },
    });
  }

  public async findById(id: number): Promise<Type | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  public async create(data: DeepPartial<Type>): Promise<Type> {
    const Type = this.repository.create(data);
    return this.repository.save(Type);
  }

  public async update(
    uuid: string,
    data: DeepPartial<Type>,
  ): Promise<UpdateResult> {
    return this.repository.update({ uuid }, data);
  }

  public async delete(uuid: string): Promise<UpdateResult> {
    return await this.repository.softDelete({ uuid });
  }
}
