import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRepository } from './city.repository';
import { City } from 'src/entities/city.entity';
import { Type } from 'class-transformer';
import { TypeRepository } from './type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([City, Type])],
  providers: [CityRepository, TypeRepository],
  exports: [CityRepository, TypeRepository],
})
export class RepositoryModule { }
