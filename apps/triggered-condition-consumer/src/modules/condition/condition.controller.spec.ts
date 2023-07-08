import { Test, TestingModule } from '@nestjs/testing';
import { ConditionConsumer } from './condition.consumer';
import { ConditionController } from './condition.controller';

describe('ConditionController', () => {
  let controller: ConditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionController],
      providers: [ConditionConsumer],
    }).compile();

    controller = module.get<ConditionController>(ConditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
