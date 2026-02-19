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

export enum RoomStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

@Entity('boarding_houses_rooms')
export class BoardingHouseRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column({
    length: 7,
  })
  code: string;

  @Column({
    length: 60,
  })
  name: string;

  @ManyToOne(
    () => BoardingHouse,
    (boardingHouse) => boardingHouse.boardingHouseRooms,
  )
  @JoinColumn({ name: 'boarding_house_id' })
  boardingHouse: BoardingHouse;

  @Column()
  capacity: number;

  @Column({
    name: 'size',
  })
  size: number;

  @Column({
    name: 'price_per_month',
    type: 'float',
  })
  pricePerMonth: number;

  @Column({
    type: 'enum',
    enum: RoomStatus,
  })
  status: RoomStatus;

  @Column({
    type: 'varchar',
    length: 255,
  })
  photo: string;

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
