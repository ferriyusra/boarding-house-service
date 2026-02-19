import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Type } from './types.entity';
import { BoardingHouse } from './boarding-house.entity';

@Entity('boarding_houses_images')
export class BoardingHouseImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(
    () => BoardingHouse,
    (boardingHouse) => boardingHouse.boardingHouseImages,
  )
  @JoinColumn({ name: 'boarding_house_id' })
  boardingHouse: BoardingHouse;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;
}
