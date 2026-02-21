/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRepository } from './city.repository';
import { City } from 'src/entities/city.entity';
import { Type } from 'class-transformer';
import { TypeRepository } from './type.repository';
import { BoardingHouse } from 'src/entities/boarding-house.entity';
import { BoardingHouseRule } from 'src/entities/boarding-house-rule.entity';
import { BoardingHouseRoom } from 'src/entities/boarding-house-room.entity';
import { BoardingHouseTestimony } from 'src/entities/boarding-house-testimony.entity';
import { BoardingHouseImage } from 'src/entities/boarding-house-image.entity';
import { BoardingHouseFacility } from 'src/entities/boarding-house-facility.entity';
import { BoardingHouseFacilityRepository } from './boarding-house-facility.repository';
import { BoardingHouseImageRepository } from './boarding-house-image.repository';
import { BoardingHouseRoomRepository } from './boarding-house-room.repository';
import { BoardingHouseRuleRepository } from './boarding-house-rule.repository';
import { BoardingHouseTestimonyRepository } from './boarding-house-testimony';
import { BoardingHouseRepository } from './boarding-house.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      City,
      Type,
      BoardingHouse,
      BoardingHouseRule,
      BoardingHouseRoom,
      BoardingHouseFacility,
      BoardingHouseTestimony,
      BoardingHouseImage,
    ]),
  ],
  providers: [
    CityRepository,
    TypeRepository,
    BoardingHouseRepository,
    BoardingHouseRuleRepository,
    BoardingHouseRoomRepository,
    BoardingHouseFacilityRepository,
    BoardingHouseTestimonyRepository,
    BoardingHouseImageRepository,
  ],
  exports: [
    CityRepository,
    TypeRepository,
    BoardingHouseRepository,
    BoardingHouseRuleRepository,
    BoardingHouseRoomRepository,
    BoardingHouseFacilityRepository,
    BoardingHouseTestimonyRepository,
    BoardingHouseImageRepository,
  ],
})
export class RepositoryModule { }
