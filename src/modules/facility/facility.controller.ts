import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FacilityService } from './facility.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardingHouseFacilityDTO } from 'src/dto/boarding-house-facility.dto';

@Controller('boarding-house-facilities')
export class FacilityController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly facilityService: FacilityService) { }

  @Get('dashboard/lists/:boarding_house_uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAll(
    @Param('boarding_house_uuid') uuid: string,
  ): Promise<any> {
    return await this.facilityService.getAll(uuid);
  }

  @Post('dashboard')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() data: BoardingHouseFacilityDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.facilityService.store(data, file);
  }

  @Delete('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async delete(@Param('uuid') uuid: string): Promise<any> {
    return await this.facilityService.delete(uuid);
  }
}
