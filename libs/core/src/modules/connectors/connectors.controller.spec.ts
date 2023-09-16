import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';

describe('ConnectorsController', () => {
  let controller: ConnectorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectorsController],
      providers: [ConnectorsService],
    }).compile();

    controller = module.get<ConnectorsController>(ConnectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
