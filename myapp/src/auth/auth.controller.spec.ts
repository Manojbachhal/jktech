import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from './enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({
        message: 'Registration successful',
        data: { email: 'test@example.com', name: 'Manoj', role: Role.VIEWER },
      }),
      login: jest.fn().mockResolvedValue({
        message: 'Login successful',
        data: { access_token: 'mock-token' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user via controller', async () => {
    const result = await controller.register({
      email: 'test@example.com',
      password: '123456',
      name: 'Manoj',
      role: Role.VIEWER,
    });

    expect(result.message).toBe('Registration successful');
    expect(authService.register).toHaveBeenCalled();
  });

  it('should login a user via controller', async () => {
    const result = await controller.login({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result.message).toBe('Login successful');
    expect(result.data.access_token).toBe('mock-token');
    expect(authService.login).toHaveBeenCalled();
  });
});
