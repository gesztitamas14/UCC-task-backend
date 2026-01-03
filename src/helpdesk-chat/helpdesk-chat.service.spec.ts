import { Test, TestingModule } from '@nestjs/testing';
import { HelpdeskChatService } from './helpdesk-chat.service';

describe('HelpdeskChatService', () => {
  let service: HelpdeskChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpdeskChatService],
    }).compile();

    service = module.get<HelpdeskChatService>(HelpdeskChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
