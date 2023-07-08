import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAlertService } from './external-alert.service';

describe('ExternalAlertService', () => {
  let service: ExternalAlertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalAlertService],
    }).compile();

    service = module.get<ExternalAlertService>(ExternalAlertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
