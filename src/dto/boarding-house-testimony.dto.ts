import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BoardingHouseTestimonyDTO {
  @IsString()
  @IsNotEmpty()
  boarding_house_uuid: string;

  @IsString()
  @IsNotEmpty()
  order_uuid: string;

  @IsString()
  @IsNotEmpty()
  user_uuid: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  testimonial: string;
}
