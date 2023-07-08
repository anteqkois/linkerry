import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAlertController } from './external-alert.controller';
import { ExternalAlertService } from './external-alert.service';

describe('ExternalAlertController', () => {
  let controller: ExternalAlertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalAlertController],
      providers: [ExternalAlertService],
    }).compile();

    controller = module.get<ExternalAlertController>(ExternalAlertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
