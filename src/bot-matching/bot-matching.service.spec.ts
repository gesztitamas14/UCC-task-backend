import { Test, TestingModule } from '@nestjs/testing';
import { BotMatchingService } from './bot-matching.service';

describe('BotMatchingService', () => {
  let service: BotMatchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotMatchingService],
    }).compile();

    service = module.get<BotMatchingService>(BotMatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
