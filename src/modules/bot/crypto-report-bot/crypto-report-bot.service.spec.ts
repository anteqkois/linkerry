import { Test, TestingModule } from '@nestjs/testing';
import { CryptoReportBotService } from './crypto-report-bot.service';

describe('CryptoReportBotService', () => {
  let service: CryptoReportBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoReportBotService],
    }).compile();

    service = module.get<CryptoReportBotService>(CryptoReportBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
