import { IsNotEmpty, IsString } from 'class-validator';

export class BoardingHouseFacilityDTO {
  @IsString()
  @IsNotEmpty()
  boarding_house_uuid: string;

  @IsString()
  @IsNotEmpty()
  rule: string;

  @IsString()
  @IsNotEmpty()
  tagline: string;
}
