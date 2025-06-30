import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../auth/enums/role.enum';
import { UserDto } from './dto/user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  // Bypass AuthGuard and RolesGuard for testing
  const mockAuthGuard = {
    canActivate: jest.fn((ctx: ExecutionContext) => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn((ctx: ExecutionContext) => true),
  };

  beforeEach(async () => {
    userService = {
      findAll: jest.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            email: 'test@example.com',
            name: 'Manoj',
            role: Role.VIEWER,
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        sort: 'ASC',
      }),
      findByEmail: jest.fn().mockResolvedValue({
        id: '1',
        name: 'Manoj',
        email: 'test@example.com',
        role: Role.EDITOR,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should return paginated users', async () => {
    const result = await controller.getUsers('1', '10', 'ASC');

    expect(result.status).toBe(1);
    expect(result.data.items.length).toBe(1);
    expect(result.data.items[0].email).toBe('test@example.com');
    expect(userService.findAll).toHaveBeenCalledWith({
      page: '1',
      size: '10',
      sort: 'ASC',
    });
  });

  it('should return user by email', async () => {
    const result = await controller.findByEmail('test@example.com');

    expect(result.status).toBe(1);
    expect(result.data.email).toBe('test@example.com');
    expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
