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
import { randomUUID } from 'crypto';
import { BoardingHouseRoomDTO } from 'src/dto/boarding-house-room.dto';
import { RoomStatus } from 'src/entities/boarding-house-room.entity';
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
  ) {}

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

      const data =
        await this.repository.findByBoardingHouseUuid(boardingHouseUuid);
      const rooms: any = [];
      for (const room of data) {
        rooms.push({
          uuid: room.uuid,
          room_name: room.name,
          room_size: room.size,
          room_capacity: room.capacity,
          room_price_per_month: room.pricePerMonth,
          room_photo: room.photo,
        });
      }

      return {
        boarding_house_photo: boardingHouse.boardingHouseImages[0].image,
        boarding_house_name: boardingHouse.name,
        city: boardingHouse.city.name,
        type: boardingHouse.type.name,
        rooms,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async countAll(): Promise<number> {
    try {
      return this.repository.count();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getLastFive(): Promise<any> {
    try {
      return await this.repository.findLastFiveRoom();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getByUuid(uuid: string): Promise<any> {
    try {
      const data = await this.repository.findOne(uuid);
      if (!data) {
        throw new BadRequestException(
          messageConstant.BOARDING_HOUSE_ROOM_NOT_FOUND,
        );
      }
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async upsert(
    data: BoardingHouseRoomDTO,
    file: Express.Multer.File,
    uuid?: string,
  ) {
    try {
      const isUpdate = Boolean(uuid);
      if (!file && !isUpdate) {
        throw new BadRequestException(messageConstant.IMAGE_ROOM_REQUIRED);
      }

      const boardingHouse = await this.boardingHouseRepository.findByUuid(
        data.boarding_house_uuid,
      );
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      let photo: string | null = '';
      if (file) {
        const uploadImage = await this.awsUtil.uploadFileToS3({
          key: `rooms/${Date.now()}-${file.originalname}`,
          body: file.buffer,
          contentType: file.mimetype,
        });
        photo = uploadImage.url;
      }

      if (isUpdate) {
        const room = await this.repository.findOne(uuid!);
        if (!room) {
          throw new BadRequestException(
            messageConstant.BOARDING_HOUSE_ROOM_NOT_FOUND,
          );
        }
        await this.repository.update(uuid!, {
          name: data.name,
          size: data.size,
          capacity: data.capacity,
          pricePerMonth: data.price_per_month,
          photo: photo ? photo : room.photo,
        });
        return await this.repository.findOne(uuid!);
      }

      return await this.repository.create({
        uuid: randomUUID(),
        name: data.name,
        size: data.size,
        capacity: data.capacity,
        pricePerMonth: data.price_per_month,
        photo: photo,
        status: RoomStatus.AVAILABLE,
        boardingHouse,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async delete(uuid: string): Promise<any> {
    try {
      const city = await this.repository.findOne(uuid);
      if (!city) {
        throw new BadRequestException(
          messageConstant.BOARDING_HOUSE_RULE_NOT_FOUND,
        );
      }

      await this.repository.deleteByUuid(uuid);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
