import { Test, TestingModule } from '@nestjs/testing';
import { BoardingHouseService } from './boarding-house.service';

describe('BoardingHouseService', () => {
  let service: BoardingHouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardingHouseService],
    }).compile();

    service = module.get<BoardingHouseService>(BoardingHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
