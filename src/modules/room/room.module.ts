import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RepositoryModule } from 'src/repositories/repository.module';
import { UtilModule } from 'src/utils/util.module';

@Module({
  imports: [RepositoryModule, UtilModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
