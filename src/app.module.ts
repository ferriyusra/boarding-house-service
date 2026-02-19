import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilModule } from './utils/util.module';
import { ConfigModule } from './config/config.module';
import { RepositoryModule } from './repositories/repository.module';

@Module({
  imports: [UtilModule, ConfigModule, RepositoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
