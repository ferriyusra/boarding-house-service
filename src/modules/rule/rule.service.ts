import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { authConstant } from 'src/constants/auth.constant';
import { messageConstant } from 'src/constants/message.constant';
import { BoardingHouseRuleDTO } from 'src/dto/boarding-house-rule.dto';
import { BoardingHouseRuleRepository } from 'src/repositories/boarding-house-rule.repository';
import { BoardingHouseRepository } from 'src/repositories/boarding-house.repository';

@Injectable()
export class RuleService {
  private logger: Logger = new Logger(RuleService.name);

  constructor(
    private readonly repository: BoardingHouseRuleRepository,
    private readonly boardingHouseRepository: BoardingHouseRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  public async getAll(boardingHouseUuid: string): Promise<any> {
    try {
      const rules =
        await this.repository.findAllByBoardingHouse(boardingHouseUuid);

      return rules.map((rule) => ({
        uuid: rule.uuid,
        name: rule.rule,
        description: rule.description,
      }));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async store(data: BoardingHouseRuleDTO): Promise<any> {
    try {
      const boardingHouse = await this.boardingHouseRepository.findByUuid(
        data.boarding_house_uuid,
      );
      if (!boardingHouse) {
        throw new BadRequestException(messageConstant.BOARDING_HOUSE_NOT_FOUND);
      }

      return await this.repository.create({
        rule: data.rule,
        description: data.description,
        boardingHouse: boardingHouse,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }

  public async delete(uuid: string): Promise<any> {
    try {
      const rule = await this.repository.findOne(uuid);
      if (!rule) {
        throw new BadRequestException(messageConstant.RULE_NOT_FOUND);
      }

      return await this.repository.deleteByUuid(uuid);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(authConstant.SOMETHING_WENT_WRONG);
    }
  }
}
