import { Test, TestingModule } from '@nestjs/testing';
import { TestimonyController } from './testimony.controller';
import { TestimonyService } from './testimony.service';

describe('TestimonyController', () => {
  let controller: TestimonyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimonyController],
      providers: [TestimonyService],
    }).compile();

    controller = module.get<TestimonyController>(TestimonyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
