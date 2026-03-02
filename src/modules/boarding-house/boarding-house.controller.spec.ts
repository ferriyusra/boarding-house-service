import { Test, TestingModule } from '@nestjs/testing';
import { BoardingHouseController } from './boarding-house.controller';
import { BoardingHouseService } from './boarding-house.service';

describe('BoardingHouseController', () => {
  let controller: BoardingHouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardingHouseController],
      providers: [BoardingHouseService],
    }).compile();

    controller = module.get<BoardingHouseController>(BoardingHouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
