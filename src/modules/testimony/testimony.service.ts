import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AuthClient } from '../../clients/auth-client';
import { authConstant } from '../../constants/auth.constant';
import type {
  IPagination,
  IQueryParams,
} from '../../interfaces/database.interface';
import { BoardingHouseTestimonyRepository } from '../../repositories/boarding-house-testimony';
import { BoardingHouseRepository } from '../../repositories/boarding-house.repository';
import { PaginationUtil } from '../../utils/pagination.util';
import moment from 'moment';
import { messageConstant } from '../../constants/message.constant';
import { BoardingHouseTestimonyDTO } from '../../dto/boarding-house-testimony.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TestimonyService {
  private logger: Logger = new Logger(TestimonyService.name);

  constructor(
    private readonly repository: BoardingHouseTestimonyRepository,
    private readonly boardingHouseRepository: BoardingHouseRepository,
    private readonly paginationUtil: PaginationUtil,
    private readonly authClient: AuthClient,
    // eslint-disable-next-line prettier/prettier
  ) { }

  public async getAllWithPagination(params: IQueryParams): Promise<any> {
    try {
      const { data, total } =
        await this.repository.findAllWithPagination(params);
      const result: any = [];
      for (const item of data) {
        const user = await this.authClient.getUserInfoWithoutToken(item.userId);
        result.push({
          uuid: item.uuid,
          rating: item.rating,
          user: user.name,
          photo: user.photo,
          date: moment(item.date).locale('id').format('DD MMMM YYYY HH:mm'),
        });
      }

      const pagination: IPagination = {
        count: total,
        pageSize: params.limit,
        page: params.page,
        data: result,
      };

      return this.paginationUtil.generatePagination(pagination);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getByUuid(uuid: string): Promise<any> {
    try {
      const testimony = await this.repository.findByUuid(uuid);
      if (!testimony) {
        throw new BadRequestException(messageConstant.TESTIMONY_NOT_FOUND);
      }

      const user = await this.authClient.getUserInfoWithoutToken(uuid);
      return {
        uuid: testimony.uuid,
        rating: testimony.rating,
        testimonial: testimony.testimonial,
        user: user.name,
        email: user.email,
        boarding_house_name: testimony.boardingHouse.name,
        photo: user.photo,
        date: moment(testimony.date).locale('id').format('DD MMMM YYYY HH:mm'),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getByOrderUuid(orderUuid: string): Promise<any> {
    try {
      return await this.repository.findByOrderId(orderUuid);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async store(data: BoardingHouseTestimonyDTO): Promise<any> {
    try {
      const boardingHouse = await this.boardingHouseRepository.findByUuid(
        data.boarding_house_uuid,
      );
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      return await this.repository.create({
        uuid: randomUUID(),
        boardingHouse: boardingHouse,
        userId: data.user_uuid,
        orderId: data.order_uuid,
        rating: data.rating,
        testimonial: data.testimonial,
        date: new Date(),
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
