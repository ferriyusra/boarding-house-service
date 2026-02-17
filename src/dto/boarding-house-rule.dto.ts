import { IsNotEmpty, IsString } from 'class-validator';

export class BoardingHouseRuleDTO {
  @IsString()
  @IsNotEmpty()
  boarding_house_uuid: string;

  @IsString()
  @IsNotEmpty()
  rule: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
