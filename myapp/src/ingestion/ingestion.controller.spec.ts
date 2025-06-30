import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles/roles.guard';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockService = {
    trigger: jest.fn().mockResolvedValue({ status: 'success' }),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should trigger ingestion and return wrapped response', async () => {
    const result = await controller.triggerIngestion();

    expect(service.trigger).toHaveBeenCalled();
    expect(result.status).toBe(1);
    expect(result.data).toEqual({ status: 'success' });
  });

  it('should handle error and throw HttpException', async () => {
    jest.spyOn(service, 'trigger').mockRejectedValueOnce(new Error('Failed'));

    await expect(controller.triggerIngestion()).rejects.toThrow('Failed');
  });
});
