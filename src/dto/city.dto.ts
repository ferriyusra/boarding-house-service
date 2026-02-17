import { IsNotEmpty, IsString } from 'class-validator';

export class CityDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
