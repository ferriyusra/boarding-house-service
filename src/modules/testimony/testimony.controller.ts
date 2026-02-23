import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TestimonyService } from './testimony.service';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import type { IQueryParams } from '../../interfaces/database.interface';

@Controller('testimony')
export class TestimonyController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly testimonyService: TestimonyService) { }

  @Get('dashboard/pagination/lists')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAllWithPagination(
    @Query() params: IQueryParams,
  ): Promise<any> {
    return await this.testimonyService.getAllWithPagination(params);
  }

  @Get('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getByUuid(@Query('uuid') uuid: string): Promise<any> {
    return await this.testimonyService.getByUuid(uuid);
  }

  @Get('order/:uuid')
  @UseGuards(RoleGuard)
  @Roles('boarder')
  public async getByOrderUuid(@Query('uuid') uuid: string): Promise<any> {
    return await this.testimonyService.getByOrderUuid(uuid);
  }

  @Post('')
  @UseGuards(RoleGuard)
  @Roles('boarder')
  public async store(@Body() body: any): Promise<any> {
    return await this.testimonyService.store(body);
  }
}
