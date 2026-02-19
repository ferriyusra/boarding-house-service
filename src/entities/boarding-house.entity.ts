import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Type } from './types.entity';
import { BoardingHouseRule } from './boarding-house-rule.entity';
import { BoardingHouseFacility as BoardingHouseImage } from './boarding-house-facility.entity';
import { BoardingHouseRoom } from './boarding-house-room.entity';
import { BoardingHouseTestimony } from './boarding-house-testimony.entity';

@Entity('boarding_houses')
export class BoardingHouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => City, (city) => city.boardingHouses)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Type, (type) => type.boardingHouses)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'contact_name',
    length: 100,
  })
  contactName: string;

  @Column({
    name: 'contact_email',
    length: 100,
  })
  contactEmail: string;

  @Column({
    name: 'contact_phone_number',
    length: 100,
  })
  contactPhoneNumber: string;

  @Column({
    name: 'is_popular',
    default: false,
  })
  isPopular: boolean;

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

  @OneToMany(() => BoardingHouseRule, (rule) => rule.boardingHouse)
  boardingHouseRules: BoardingHouseRule[];

  @OneToMany(() => BoardingHouseImage, (facility) => facility.boardingHouse)
  boardingHouseFacilities: BoardingHouseImage[];

  @OneToMany(() => BoardingHouseImage, (image) => image.boardingHouse)
  boardingHouseImages: BoardingHouseImage[];

  @OneToMany(() => BoardingHouseRoom, (room) => room.boardingHouse)
  boardingHouseRooms: BoardingHouseRoom[];

  @OneToMany(
    () => BoardingHouseTestimony,
    (testimony) => testimony.boardingHouse,
  )
  boardingHouseTestimonies: BoardingHouseTestimony[];
}
