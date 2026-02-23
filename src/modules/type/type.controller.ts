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
import { TypeService } from './type.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/role.decorator';
import { TypeDTO } from '../../dto/type.dto';
import { RoleGuard } from '../../guards/role.guard';
import type { IQueryParams } from '../../interfaces/database.interface';

@Controller('type')
export class TypeController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly typeService: TypeService) { }

  @Get('dashboard/pagination/lists')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAllWithPagination(
    @Query() params: IQueryParams,
  ): Promise<any> {
    return await this.typeService.getAllWithPagination(params);
  }

  @Get('/lists')
  public async getAllWithoutPagination(): Promise<any> {
    return await this.typeService.getAllWithoutPagination();
  }

  @Get('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getByUuid(@Query('uuid') uuid: string): Promise<any> {
    return await this.typeService.getByUuid(uuid);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('photo'))
  public async store(
    @Body() data: TypeDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.typeService.create(data, file);
  }

  @Put('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('photo'))
  public async update(
    @Query('uuid') uuid: string,
    @Body() data: TypeDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.typeService.update(uuid, data, file);
  }

  @Delete('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async delete(@Query('uuid') uuid: string): Promise<any> {
    return await this.typeService.delete(uuid);
  }
}
