import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { authConstant } from '../../constants/auth.constant';
import { messageConstant } from '../../constants/message.constant';
import { CityDTO } from '../../dto/city.dto';
import { IPagination, IQueryParams } from '../../interfaces/database.interface';
import { CityRepository } from '../../repositories/city.repository';
import { AwsUtil } from '../../utils/aws.utils';
import { PaginationUtil } from '../../utils/pagination.util';

@Injectable()
export class CityService {
  private logger: Logger = new Logger(CityService.name);

  constructor(
    private readonly repository: CityRepository,
    private awsUtil: AwsUtil,
    private paginationUtil: PaginationUtil,
    // eslint-disable-next-line prettier/prettier
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

  public async getByUuid(uuid: string): Promise<any> {
    try {
      const city = await this.repository.findByUuid(uuid);
      if (!city) {
        throw new BadRequestException(messageConstant.CITY_NOT_FOUND);
      }
      return city;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async create(data: CityDTO, file?: Express.Multer.File): Promise<any> {
    try {
      let photo: string | null = '';
      if (file) {
        const uploadImage = await this.awsUtil.uploadFileToS3({
          key: `cities/${randomUUID()}-${file.originalname}`,
          body: file.buffer,
          contentType: file.mimetype,
        });
        photo = uploadImage.url;
      }

      return this.repository.create({
        uuid: randomUUID(),
        name: data.name,
        photo: photo as string,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async update(
    uuid: string,
    data: CityDTO,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const city = await this.repository.findByUuid(uuid);
      if (!city) {
        throw new BadRequestException(messageConstant.CITY_NOT_FOUND);
      }

      let photo: string | null = '';
      if (file) {
        const uploadImage = await this.awsUtil.uploadFileToS3({
          key: `cities/${randomUUID()}-${file.originalname}`,
          body: file.buffer,
          contentType: file.mimetype,
        });
        photo = uploadImage.url;
      }

      await this.repository.update(city.uuid, {
        name: data.name,
        photo: photo as string,
      });

      return await this.repository.findByUuid(city.uuid);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async delete(uuid: string): Promise<any> {
    try {
      const city = await this.repository.findByUuid(uuid);
      if (!city) {
        throw new BadRequestException(messageConstant.CITY_NOT_FOUND);
      }

      await this.repository.delete(uuid);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
