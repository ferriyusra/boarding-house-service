import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CityService } from './city.service';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import type { IQueryParams } from '../../interfaces/database.interface';
import { CityDTO } from '../../dto/city.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cities')
export class CityController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cityService: CityService) { }

  @Get('dashboard/pagination/lists')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAllWithPagination(
    @Query() params: IQueryParams,
  ): Promise<any> {
    return await this.cityService.getAllWithPagination(params);
  }

  @Get('/lists')
  public async getAllWithoutPagination(): Promise<any> {
    return await this.cityService.getAllWithoutPagination();
  }

  @Get('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getByUuid(@Query('uuid') uuid: string): Promise<any> {
    return await this.cityService.getByUuid(uuid);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('photo'))
  public async store(
    @Body() data: CityDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.cityService.create(data, file);
  }

  @Put('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('photo'))
  public async update(
    @Query('uuid') uuid: string,
    @Body() data: CityDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.cityService.update(uuid, data, file);
  }

  @Delete('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async delete(@Query('uuid') uuid: string): Promise<any> {
    return await this.cityService.delete(uuid);
  }
}
