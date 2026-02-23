import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { UtilModule } from '../../utils/util.module';
import { RepositoryModule } from '../../repositories/repository.module';

@Module({
  imports: [RepositoryModule, UtilModule],
  controllers: [CityController],
  providers: [CityService],
})
// eslint-disable-next-line prettier/prettier
export class CityModule { }
