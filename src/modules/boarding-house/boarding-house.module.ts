import { Module } from '@nestjs/common';
import { BoardingHouseService } from './boarding-house.service';
import { BoardingHouseController } from './boarding-house.controller';
import { RepositoryModule } from '../../repositories/repository.module';
import { UtilModule } from '../../utils/util.module';
import { ClientModule } from '../../clients/client.module';

@Module({
  imports: [RepositoryModule, UtilModule, ClientModule],
  controllers: [BoardingHouseController],
  providers: [BoardingHouseService],
})
// eslint-disable-next-line prettier/prettier
export class BoardingHouseModule { }
