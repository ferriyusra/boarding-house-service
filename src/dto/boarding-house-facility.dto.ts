import { IsNotEmpty, IsString } from 'class-validator';

export class BoardingHouseFacilityDTO {
  @IsString()
  @IsNotEmpty()
  boarding_house_uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tagline: string;
}
