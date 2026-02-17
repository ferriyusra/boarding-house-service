import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BoardingHouseRoomDTO {
  @IsString()
  @IsNotEmpty()
  boarding_house_uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsNumber()
  @IsNotEmpty()
  price_per_month: number;
}
