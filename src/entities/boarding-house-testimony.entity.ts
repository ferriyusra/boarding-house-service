import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardingHouse } from './boarding-house.entity';

@Entity('boarding_houses_testimonies')
export class BoardingHouseTestimony {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @ManyToOne(
    () => BoardingHouse,
    (boardingHouse) => boardingHouse.boardingHouseTestimonies,
  )
  @JoinColumn({ name: 'boarding_house_id' })
  boardingHouse: BoardingHouse;

  @Column({
    length: 36,
  })
  userId: string;

  @Column({
    length: 36,
  })
  orderId: string;

  @Column()
  rating: number;

  @Column()
  date: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  testimonial: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
