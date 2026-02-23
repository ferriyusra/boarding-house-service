import { Module } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityController } from './facility.controller';
import { RepositoryModule } from 'src/repositories/repository.module';
import { UtilModule } from 'src/utils/util.module';

@Module({
  imports: [RepositoryModule, UtilModule],
  controllers: [FacilityController],
  providers: [FacilityService],
})
// eslint-disable-next-line prettier/prettier
export class FacilityModule { }
