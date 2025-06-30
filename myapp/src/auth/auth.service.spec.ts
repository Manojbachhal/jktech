import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;

  beforeEach(async () => {
    userRepo = {
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((user) => user),
      save: jest.fn().mockImplementation((user) => ({
        ...user,
        id: 'mock-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a user and return message + data without password', async () => {
    const dto = {
      email: 'test@example.com',
      password: '123456',
      name: 'Manoj',
      role: Role.VIEWER,
    };

    const result = await service.register(dto);

    expect(result.message).toBe('Registration successful');
    expect(result.data.email).toBe(dto.email);
    expect(result.data.password).toBeUndefined();
    expect(userRepo.findOneBy).toHaveBeenCalledWith({ email: dto.email });
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('should login user and return JWT token', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    userRepo.findOneBy = jest.fn().mockResolvedValue({
      id: 'mock-id',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'viewer',
    });

    const jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    const result = await service.login({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result.message).toBe('Login successful');
    expect(result.data.access_token).toBe('mock-token');
  });
});
