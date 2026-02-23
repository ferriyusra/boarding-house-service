import { Module } from '@nestjs/common';
import { TestimonyService } from './testimony.service';
import { TestimonyController } from './testimony.controller';
import { RepositoryModule } from '../../repositories/repository.module';
import { UtilModule } from '../../utils/util.module';
import { ClientModule } from '../../clients/client.module';

@Module({
  imports: [RepositoryModule, UtilModule, ClientModule],
  controllers: [TestimonyController],
  providers: [TestimonyService],
})
// eslint-disable-next-line prettier/prettier
export class TestimonyModule { }
