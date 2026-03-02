import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { authConstant } from 'src/constants/auth.constant';
import { messageConstant } from 'src/constants/message.constant';
import type {
  IQueryParams,
  IPagination,
} from 'src/interfaces/database.interface';
import { BoardingHouseRoomRepository } from 'src/repositories/boarding-house-room.repository';
import { BoardingHouseRepository } from 'src/repositories/boarding-house.repository';
import { AwsUtil } from 'src/utils/aws.utils';
import { PaginationUtil } from 'src/utils/pagination.util';

@Injectable()
export class RoomService {
  private logger: Logger = new Logger(RoomService.name);

  constructor(
    private readonly repository: BoardingHouseRoomRepository,
    private readonly boardingHouseRepository: BoardingHouseRepository,
    private readonly paginationUtil: PaginationUtil,
    private readonly awsUtil: AwsUtil,
  ) { }
  public async getAllWithPagination(params: IQueryParams): Promise<any> {
    try {
      const { data, total } =
        await this.repository.findAllWithPagination(params);
      const paginationParams: IPagination = {
        count: total,
        pageSize: params.limit,
        page: params.page,
        data: data,
      };
      return this.paginationUtil.generatePagination(paginationParams);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getAllWithoutPagination(): Promise<any> {
    try {
      return await this.repository.findAllWithoutPagination();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getAllByBoardingHouseUuid(
    boardingHouseUuid: string,
  ): Promise<any> {
    try {
      const boardingHouse =
        await this.boardingHouseRepository.findByUuid(boardingHouseUuid);
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      const data = await this.repository.findByBoardingHouseUuid(boardingHouseUuid);
      const rooms: any = [];
      for (const room of data) {
        rooms.push({
          uuid: room.uuid,
          room_name: room.name,
          room_size: room.size,
          room_capacity: 
        })
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
