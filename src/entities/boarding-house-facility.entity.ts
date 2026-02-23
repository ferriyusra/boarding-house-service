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
import { BoardingHouse } from './boarding-house.entity';

@Entity('boarding_houses_facilities')
export class BoardingHouseFacility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(
    () => BoardingHouse,
    (boardingHouse) => boardingHouse.boardingHouseFacilities,
  )
  @JoinColumn({ name: 'boarding_house_id' })
  boardingHouse: BoardingHouse;

  @Column({
    type: 'text',
    nullable: true,
  })
  tagline: string;

  @Column()
  image: string;

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
