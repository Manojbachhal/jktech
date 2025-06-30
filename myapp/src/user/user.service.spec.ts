import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepo: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    userRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users with pagination', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'Manoj',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'viewer',
      },
    ];

    userRepo.findAndCount!.mockResolvedValueOnce([mockUsers, 1]);

    const result = await service.findAll({
      page: '1',
      size: '10',
      sort: 'ASC',
    });

    expect(userRepo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { createdAt: 'ASC' },
    });

    expect(result.data[0].email).toBe('test@example.com');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.size).toBe(10);
  });

  it('should return user by email', async () => {
    const user = {
      id: '1',
      name: 'Manoj',
      email: 'themanojbachhal@gmail.com',
    };

    userRepo.findOne!.mockResolvedValueOnce(user);

    const result = await service.findByEmail('themanojbachhal@gmail.com');

    expect(result.email).toBe('themanojbachhal@gmail.com');
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'themanojbachhal@gmail.com' },
    });
  });
});
