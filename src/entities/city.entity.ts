import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardingHouse } from './boarding-house.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column({
    name: 'number_of_unit',
    default: 0,
  })
  numberOfUnit: number;

  @Column({
    nullable: true,
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

  @OneToMany(() => BoardingHouse, (boardingHouse) => boardingHouse.city)
  boardingHouses: BoardingHouse[];
}
