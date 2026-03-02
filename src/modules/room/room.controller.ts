import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoleGuard } from 'src/guards/role.guard';
import type { IQueryParams } from 'src/interfaces/database.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardingHouseRoomDTO } from 'src/dto/boarding-house-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('dashboard/pagination/lists')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAllWithPagination(@Query() params: IQueryParams) {
    return this.roomService.getAllWithPagination(params);
  }

  @Get('dashboard/lists')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAllWithoutPagination() {
    return this.roomService.getAllWithoutPagination();
  }

  @Get('dashboard/total')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async countAll() {
    return this.roomService.countAll();
  }

  @Get('dashboard/last-five')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getLastFive() {
    return this.roomService.getLastFive();
  }

  @Get('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getByUuid(@Param('uuid') uuid: string) {
    return this.roomService.getByUuid(uuid);
  }

  @Post('dashboard')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('photos'))
  public async create(
    @Body() data: BoardingHouseRoomDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roomService.upsert(data, file);
  }

  @Put('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('photos'))
  public async update(
    @Param('uuid') uuid: string,
    @Body() data: BoardingHouseRoomDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roomService.upsert(data, file, uuid);
  }

  @Delete('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async delete(@Param('uuid') uuid: string) {
    return this.roomService.delete(uuid);
  }
}
