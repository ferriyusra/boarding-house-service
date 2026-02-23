import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { authConstant } from '../../constants/auth.constant';
import { messageConstant } from '../../constants/message.constant';
import { TypeDTO } from '../../dto/type.dto';
import { IPagination, IQueryParams } from '../../interfaces/database.interface';
import { TypeRepository } from '../../repositories/type.repository';
import { AwsUtil } from '../../utils/aws.utils';
import { PaginationUtil } from '../../utils/pagination.util';

@Injectable()
export class TypeService {
  private logger: Logger = new Logger(TypeService.name);

  constructor(
    private readonly repository: TypeRepository,
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
      const type = await this.repository.findByUuid(uuid);
      if (!type) {
        throw new BadRequestException(messageConstant.TYPE_NOT_FOUND);
      }
      return type;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async create(data: TypeDTO, file?: Express.Multer.File): Promise<any> {
    try {
      let photo: string | null = '';
      if (file) {
        const uploadImage = await this.awsUtil.uploadFileToS3({
          key: `room-types/${randomUUID()}-${file.originalname}`,
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
    data: TypeDTO,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const city = await this.repository.findByUuid(uuid);
      if (!city) {
        throw new BadRequestException(messageConstant.TYPE_NOT_FOUND);
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
        throw new BadRequestException(messageConstant.TYPE_NOT_FOUND);
      }

      await this.repository.delete(uuid);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
