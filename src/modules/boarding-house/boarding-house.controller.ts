import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardingHouseService } from './boarding-house.service';
import { RoleGuard } from 'src/guards/role.guard';
import type {
  IQueryParams,
  ISearchParams,
} from 'src/interfaces/database.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { BoardingHouseDTO } from 'src/dto/boarding-house.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('boarding-house')
export class BoardingHouseController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly boardingHouseService: BoardingHouseService) { }

  @Get('dashboard/pagination/lists')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAllWithPagination(@Query() params: IQueryParams) {
    return await this.boardingHouseService.getAllWithPagination(params);
  }

  @Get('lists')
  public async getList() {
    return await this.boardingHouseService.getList();
  }

  @Get('popular-lists')
  public async getPopularBoardingHouse() {
    return await this.boardingHouseService.getPopularBoardingHouse();
  }

  @Get('five-lists')
  public async getFiveBoardingHouse() {
    return await this.boardingHouseService.getFiveBoardingHouse();
  }

  @Get('find')
  public async getBoardingHouseWithSearch(@Query() params: ISearchParams) {
    return await this.boardingHouseService.getBoardingHouseWithSearch(params);
  }

  @Get('type-lists/:uuid')
  public async getTypeUuid(@Param('uuid') uuid: string) {
    return await this.boardingHouseService.getByTypeOrCityUuid(uuid);
  }

  @Get('city-lists/:uuid')
  public async getTypeCityUuid(@Param('uuid') uuid: string) {
    return await this.boardingHouseService.getByTypeOrCityUuid(uuid);
  }

  @Get('dashboard/total')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async countAll() {
    return await this.boardingHouseService.countAll();
  }

  @Get('dashboard/:uuid')
  public async getByUuid(@Param('uuid') uuid: string) {
    return await this.boardingHouseService.getByUuid(uuid);
  }

  @Get('detail/:uuid')
  public async getForDetail(@Param('uuid') uuid: string) {
    return await this.boardingHouseService.getForDetail(uuid);
  }

  @Post('dashboard')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('photos'))
  public async create(
    @Body() data: BoardingHouseDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.boardingHouseService.store(data, files);
  }

  @Put('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('photos'))
  public async update(
    @Param('uuid') uuid: string,
    @Body() data: BoardingHouseDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.boardingHouseService.update(uuid, data, files);
  }

  @Delete('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async delete(@Param('uuid') uuid: string) {
    return await this.boardingHouseService.delete(uuid);
  }
}
