import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { authConstant } from '../../constants/auth.constant';
import { messageConstant } from '../../constants/message.constant';
import { BoardingHouseFacilityDTO } from '../../dto/boarding-house-facility.dto';
import { BoardingHouseFacilityRepository } from '../../repositories/boarding-house-facility.repository';
import { BoardingHouseRepository } from '../../repositories/boarding-house.repository';
import { AwsUtil } from '../../utils/aws.utils';

@Injectable()
export class FacilityService {
  private logger: Logger = new Logger(FacilityService.name);

  constructor(
    private readonly repository: BoardingHouseFacilityRepository,
    private readonly boardingHouseRepository: BoardingHouseRepository,
    private readonly awsUtil: AwsUtil,
    // eslint-disable-next-line prettier/prettier
  ) { }

  public async getAll(boardingHouseUuid: string): Promise<any> {
    try {
      const facilities =
        await this.repository.findAllByBoardingHouse(boardingHouseUuid);

      return facilities.map((facility) => ({
        uuid: facility.uuid,
        name: facility.name,
        tagline: facility.tagline,
        photo: facility.image,
      }));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async store(
    data: BoardingHouseFacilityDTO,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const boardingHouse = await this.boardingHouseRepository.findByUuid(
        data.boarding_house_uuid,
      );
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      if (!file) {
        throw new BadRequestException(messageConstant.IMAGE_FACILITY_REQUIRED);
      }

      const uploadImage = await this.awsUtil.uploadFileToS3({
        key: `facilities/${randomUUID()}-${Date.now()}-${file.originalname}`,
        body: file.buffer,
        contentType: file.mimetype,
      });

      return await this.repository.create({
        uuid: randomUUID(),
        name: data.name,
        tagline: data.tagline,
        image: uploadImage.url!,
        boardingHouse: boardingHouse,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async delete(uuid: string): Promise<any> {
    try {
      const facility = await this.repository.findOne(uuid);
      if (!facility) {
        throw new BadRequestException(
          messageConstant.BOARDING_HOUSE_FACILITY_NOT_FOUND,
        );
      }

      return await this.repository.deleteByUuid(uuid);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
