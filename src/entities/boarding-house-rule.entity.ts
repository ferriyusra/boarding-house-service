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

@Entity('boarding_houses_rules')
export class BoardingHouseRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  rule: string;

  @ManyToOne(
    () => BoardingHouse,
    (boardingHouse) => boardingHouse.boardingHouseRules,
  )
  @JoinColumn({ name: 'boarding_house_id' })
  boardingHouse: BoardingHouse;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

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
