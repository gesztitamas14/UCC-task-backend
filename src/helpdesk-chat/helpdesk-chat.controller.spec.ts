import { Test, TestingModule } from '@nestjs/testing';
import { HelpdeskChatController } from './helpdesk-chat.controller';
import { HelpdeskChatService } from './helpdesk-chat.service';

describe('HelpdeskChatController', () => {
  let controller: HelpdeskChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpdeskChatController],
      providers: [HelpdeskChatService],
    }).compile();

    controller = module.get<HelpdeskChatController>(HelpdeskChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
