import { IsNotEmpty, IsString } from 'class-validator';

export class TypeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
