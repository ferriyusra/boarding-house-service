import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { RepositoryModule } from '../../repositories/repository.module';
import { UtilModule } from '../../utils/util.module';

@Module({
  imports: [RepositoryModule, UtilModule],
  controllers: [TypeController],
  providers: [TypeService],
})
// eslint-disable-next-line prettier/prettier
export class TypeModule { }
