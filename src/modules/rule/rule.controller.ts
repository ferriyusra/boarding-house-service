import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { BoardingHouseRuleDTO } from 'src/dto/boarding-house-rule.dto';

@Controller('boarding-house-rules')
export class RuleController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly ruleService: RuleService) { }

  @Get('dashboard/lists/:boarding_house_uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async getAll(
    @Param('boarding_house_uuid') uuid: string,
  ): Promise<any> {
    return await this.ruleService.getAll(uuid);
  }

  @Post('dashboard')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async create(@Body() data: BoardingHouseRuleDTO): Promise<any> {
    return await this.ruleService.store(data);
  }

  @Delete('dashboard/:uuid')
  @UseGuards(RoleGuard)
  @Roles('admin')
  public async delete(@Param('uuid') uuid: string): Promise<any> {
    return await this.ruleService.delete(uuid);
  }
}
