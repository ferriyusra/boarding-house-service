import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BoardingHouseDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city_id: string;

  @IsString()
  @IsNotEmpty()
  type_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  contact_name: string;

  @IsString()
  @IsNotEmpty()
  contact_email: string;

  @IsString()
  @IsNotEmpty()
  contact_phone_number: string;
}
