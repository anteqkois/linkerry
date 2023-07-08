import { Test, TestingModule } from '@nestjs/testing';
import { ConditionConsumer } from './condition.consumer';

describe('ConditionService', () => {
  let service: ConditionConsumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionConsumer],
    }).compile();

    service = module.get<ConditionConsumer>(ConditionConsumer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
