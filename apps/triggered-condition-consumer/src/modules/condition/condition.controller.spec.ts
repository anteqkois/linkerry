import { Test, TestingModule } from '@nestjs/testing';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';

describe('ConditionController', () => {
  let controller: ConditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionController],
      providers: [ConditionService],
    }).compile();

    controller = module.get<ConditionController>(ConditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
