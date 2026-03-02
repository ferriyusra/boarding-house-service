import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import moment from 'moment';
import { AuthClient } from 'src/clients/auth-client';
import { authConstant } from 'src/constants/auth.constant';
import { messageConstant } from 'src/constants/message.constant';
import { BoardingHouseDTO } from 'src/dto/boarding-house.dto';
import { BoardingHouseImage } from 'src/entities/boarding-house-image.entity';
import { IQueryParams, ISearchParams } from 'src/interfaces/database.interface';
import { BoardingHouseFacilityRepository } from 'src/repositories/boarding-house-facility.repository';
import { BoardingHouseImageRepository } from 'src/repositories/boarding-house-image.repository';
import { BoardingHouseRoomRepository } from 'src/repositories/boarding-house-room.repository';
import { BoardingHouseRuleRepository } from 'src/repositories/boarding-house-rule.repository';
import { BoardingHouseTestimonyRepository } from 'src/repositories/boarding-house-testimony';
import { BoardingHouseRepository } from 'src/repositories/boarding-house.repository';
import { CityRepository } from 'src/repositories/city.repository';
import { TypeRepository } from 'src/repositories/type.repository';
import { AwsUtil } from 'src/utils/aws.utils';
import { CustomUtil } from 'src/utils/custom.util';
import { PaginationUtil } from 'src/utils/pagination.util';
import { DeepPartial } from 'typeorm';

@Injectable()
export class BoardingHouseService {
  private logger: Logger = new Logger(BoardingHouseService.name);

  constructor(
    private readonly repository: BoardingHouseRepository,
    private readonly boardingHouseRuleRepository: BoardingHouseRuleRepository,
    private readonly boardingHouseRoomRepository: BoardingHouseRoomRepository,
    private readonly boardingHouseImageRepository: BoardingHouseImageRepository,
    private readonly boardingHouseFacilityRepository: BoardingHouseFacilityRepository,
    private readonly boardingHouseTestimony: BoardingHouseTestimonyRepository,
    private readonly typeRepository: TypeRepository,
    private readonly cityRepository: CityRepository,
    private readonly paginationUtils: PaginationUtil,
    private readonly awsUtil: AwsUtil,
    private readonly customUtil: CustomUtil,
    private readonly authClient: AuthClient,
    // eslint-disable-next-line prettier/prettier
  ) { }

  public async getAllWithPagination(params: IQueryParams): Promise<any> {
    try {
      const { data, total } =
        await this.repository.findAllWithPagination(params);
      const results: any = [];
      for (const item of data) {
        const photo =
          await this.boardingHouseImageRepository.findOneByBoardingHouse(
            item.uuid,
          );
        const rooms =
          await this.boardingHouseRoomRepository.countRoomByBoardingHouse(item);
        results.push({
          uuid: item.uuid,
          name: item.name,
          type: item.type.name,
          city: item.city.name,
          photo: photo ? photo.url : null,
          rooms: rooms ?? [],
        });
      }
      const paginationParams = {
        count: total,
        pageSize: params.limit,
        page: params.page,
        data: results,
      };
      return this.paginationUtils.generatePagination(paginationParams);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getList(): Promise<any> {
    try {
      return await this.repository.findAllWithoutPagination();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getPopularBoardingHouse(): Promise<any> {
    try {
      const data = await this.repository.findAll(3, true);
      const results: any = [];
      for (const item of data) {
        const rooms =
          await this.boardingHouseRoomRepository.findByBoardingHouseUuid(
            item.uuid,
          );
        if (item.boardingHouseRooms.length > 0) {
          results.push({
            uuid: item.uuid,
            name: item.name,
            city: item.city.name,
            type: item.type.name,
            photo: item.boardingHouseImages.length
              ? item.boardingHouseImages[0].url
              : null,
            price: this.customUtil.getLowerPricePerMonth(rooms),
            isFull: rooms.length === 0,
          });
        }
      }
      return results;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getByTypeOrCityUuid(
    typeUuid?: string,
    cityUuid?: string,
  ): Promise<{
    name: string;
    number_of_unit: number;
    result: any[];
  }> {
    try {
      let context: {
        name: string;
        number_of_unit: number;
        data: any[];
      };

      if (typeUuid) {
        const type = await this.typeRepository.findByUuid(typeUuid);
        if (!type) {
          throw new BadRequestException(messageConstant.TYPE_NOT_FOUND);
        }

        const data = await this.repository.findByTypeOrCity(typeUuid, null);
        context = {
          name: type.name,
          number_of_unit: type.numberOfUnit,
          data,
        };
      } else {
        const city = await this.cityRepository.findByUuid(cityUuid!);
        if (!city) {
          throw new BadRequestException(messageConstant.CITY_NOT_FOUND);
        }

        const data = await this.repository.findByTypeOrCity(typeUuid, null);
        context = {
          name: city.name,
          number_of_unit: city.numberOfUnit,
          data,
        };
      }

      const result = await Promise.all(
        context.data
          .filter((item) => item.boardingHouseRoom.length > 0)
          .map(async (item) => {
            const rooms =
              await this.boardingHouseRoomRepository.findByBoardingHouseUuid(
                item.uuid,
              );

            return {
              uuid: item.uuid,
              name: item.name,
              city: item.city.name,
              type: item.type.name,
              photo: item.boardingHouseImages.length
                ? item.boardingHouseImages[0].url
                : null,
              price: this.customUtil.getLowerPricePerMonth(rooms),
              isFull: rooms.length === 0,
            };
          }),
      );

      return {
        name: context.name,
        number_of_unit: context.number_of_unit,
        result,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getForDetail(uuid: string): Promise<any> {
    try {
      const data = await this.repository.findByUuid(uuid);
      if (!data) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      const images: any = [];
      data.boardingHouseImages.map((image: any) => {
        image.push({
          url: image.url,
        });
      });

      const rules: any = [];
      data.boardingHouseRules.map((rule: any) => {
        rule.push({
          name: rule.rule,
          description: rule.description,
        });
      });

      const facilities: any = [];
      data.boardingHouseFacilities.map((facility: any) => {
        facility.push({
          photo: facility.photo,
          name: facility.name,
          tagline: facility.tagline,
        });
      });

      const rooms =
        await this.boardingHouseRoomRepository.findByBoardingHouseUuid(uuid);

      const ratings: any = [];
      const testimonies: any = [];
      for (const item of data.boardingHouseTestimonies) {
        ratings.push(item.rating);
        const user = await this.authClient.getUserInfoWithoutToken(item.userId);
        testimonies.push({
          photo: user?.photo || null,
          name: user?.name || null,
          rating: item.rating,
          testimonial: item.testimonial,
          date: moment(item.date).locale('id').format('DD MM YYYY HH:mm'),
        });
      }

      const total = ratings.reduce((sum: any, r: any) => sum + r, 0);
      const average = total / ratings.length;

      return {
        uuid: data.uuid,
        name: data.name,
        description: data.description,
        address: data.address,
        type: data.type.name,
        city: data.city.name,
        contact_name: data.contactName,
        contact_phone_number: data.contactPhoneNumber,
        contact_email: data.contactEmail,
        price:
          data.boardingHouseRooms.length > 0
            ? this.customUtil.getLowerPricePerMonth(rooms)
            : 0,
        images,
        rules,
        facilities,
        testimonies,
        rating: ratings.length > 0 ? average : 0,
        isFull: rooms.length === 0,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getBoardingHouseWithSearch(params: ISearchParams): Promise<any> {
    try {
      const boardingHouses = await this.repository.findWithSearch(params);
      const results: any = [];
      for (const item of boardingHouses) {
        const rooms =
          await this.boardingHouseRoomRepository.findByBoardingHouseUuid(
            item.uuid,
          );
        if (item.boardingHouseRooms.length > 0) {
          results.push({
            uuid: item.uuid,
            name: item.name,
            city: item.city.name,
            type: item.type.name,
            photo: item.boardingHouseImages.length
              ? item.boardingHouseImages[0].url
              : null,
            price: this.customUtil.getLowerPricePerMonth(rooms),
            isFull: rooms.length === 0,
          });
        } else {
          return [];
        }
      }
      return results;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async getByUuid(uuid: string): Promise<any> {
    try {
      const data = await this.repository.findByUuid(uuid);
      if (!data) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND)
      }
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
  public async getFiveBoardingHouse(): Promise<any> {
    try {
      const data = await this.repository.findAll(5);
      const results: any = [];
      for (const item of data) {
        const rooms =
          await this.boardingHouseRoomRepository.findByBoardingHouseUuid(
            item.uuid,
          );

        if (item.boardingHouseRooms.length > 0) {
          results.push({
            uuid: item.uuid,
            name: item.name,
            city: item.city.name,
            type: item.type.name,
            photo: item.boardingHouseImages.length
              ? item.boardingHouseImages[0].url
              : null,
            price: this.customUtil.getLowerPricePerMonth(rooms),
            isFull: rooms.length,
          });
        }
      }
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

  public async store(data: BoardingHouseDTO, files: Express.Multer.File[]) {
    try {
      const type = await this.typeRepository.findByUuid(data.type_id);
      if (!type) {
        throw new BadRequestException(messageConstant.TYPE_NOT_FOUND);
      }

      const city = await this.cityRepository.findByUuid(data.city_id);
      if (!city) {
        throw new BadRequestException(messageConstant.CITY_NOT_FOUND);
      }

      if (files.length === 0) {
        throw new BadRequestException(messageConstant.PHOTOS_REQUIRED);
      }

      const boardingHouse = await this.repository.create({
        uuid: randomUUID(),
        name: data.name,
        description: data.description,
        address: data.address,
        contactName: data.contact_name,
        contactPhoneNumber: data.contact_phone_number,
        contactEmail: data.contact_email,
        type: type,
        city: city,
      });

      const photos: DeepPartial<BoardingHouseImage>[] = [];
      for (const file of files) {
        const image = await this.awsUtil.uploadFileToS3({
          key: `boarding-house/${randomUUID()}-${file.originalname}`,
          body: file.buffer,
          contentType: file.mimetype,
        });
        photos.push({
          boardingHouse: {
            id: boardingHouse.id,
          },
          url: image.url,
        });
      }

      await this.boardingHouseImageRepository.create(photos);
      await this.typeRepository.update(data.type_id, {
        numberOfUnit: type.numberOfUnit + 1,
      });
      await this.cityRepository.update(data.city_id, {
        numberOfUnit: type.numberOfUnit + 1,
      });

      return boardingHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async update(
    uuid: string,
    data: BoardingHouseDTO,
    files: Express.Multer.File[],
  ) {
    try {
      const boardingHouse = await this.repository.findByUuid(uuid);
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      const type = await this.typeRepository.findByUuid(data.type_id);
      if (!type) {
        throw new BadRequestException(messageConstant.TYPE_NOT_FOUND);
      }

      const city = await this.cityRepository.findByUuid(data.city_id);
      if (!city) {
        throw new BadRequestException(messageConstant.CITY_NOT_FOUND);
      }

      await this.repository.update(boardingHouse.uuid, {
        name: data.name,
        description: data.description,
        address: data.address,
        contactName: data.contact_name,
        contactPhoneNumber: data.contact_phone_number,
        contactEmail: data.contact_email,
        type: type,
        city: city,
      });

      if (files && files.length > 0) {
        await this.boardingHouseImageRepository.delete(boardingHouse);
        const photos: DeepPartial<BoardingHouseImage>[] = [];
        for (const file of files) {
          const image = await this.awsUtil.uploadFileToS3({
            key: `boarding-house/${randomUUID()}-${file.originalname}`,
            body: file.buffer,
            contentType: file.mimetype,
          });
          photos.push({
            boardingHouse: {
              id: boardingHouse.id,
            },
            url: image.url,
          });
        }
        await this.boardingHouseImageRepository.create(photos);
      }

      return await this.repository.findByUuid(uuid);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async delete(uuid: string): Promise<any> {
    try {
      const boardingHouse = await this.repository.findByUuid(uuid);
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      await this.repository.delete(uuid);
      await this.boardingHouseRuleRepository.deleteByBoardingHouse(
        boardingHouse,
      );
      await this.boardingHouseRoomRepository.deleteByBoardingHouse(
        boardingHouse,
      );
      await this.boardingHouseImageRepository.delete(boardingHouse);
      await this.boardingHouseTestimony.delete(boardingHouse);
      await this.boardingHouseFacilityRepository.deleteByBoardingHouse(
        boardingHouse,
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
