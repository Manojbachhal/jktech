import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let docRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    docRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };

    userRepo = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getRepositoryToken(Document), useValue: docRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should save a document and return it', async () => {
    const user = {
      id: '1',
      name: 'Manoj',
      email: 'test@example.com',
      role: 'viewer',
    };
    const doc = {
      id: 'doc-id',
      title: 'Test File',
      filePath: 'uploads/test.pdf',
      owner: user,
    };

    userRepo.findOneBy.mockResolvedValue(user);
    docRepo.create.mockReturnValue(doc);
    docRepo.save.mockResolvedValue(doc);

    const result = await service.saveDocument(
      'uploads/test.pdf',
      'Test File',
      '1',
    );

    expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(docRepo.create).toHaveBeenCalled();
    expect(docRepo.save).toHaveBeenCalled();
    expect(result.title).toBe('Test File');
  });

  it('should find all documents with pagination', async () => {
    const doc = {
      id: '1',
      title: 'Doc Title',
      filePath: 'uploads/demo.pdf',
      createdAt: new Date(),
      owner: {
        id: 'u1',
        name: 'User',
        email: 'user@mail.com',
        role: 'viewer',
      },
    };

    docRepo.findAndCount.mockResolvedValue([[doc], 1]);

    const result = await service.findAll({
      page: '1',
      size: '10',
      sort: 'ASC',
    });

    expect(docRepo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { createdAt: 'ASC' },
      relations: ['owner'],
    });

    expect(result.total).toBe(1);
    expect(result.data[0].filePath).toContain('/uploads/');
  });

  it('should return a document by ID', async () => {
    const doc = {
      id: '1',
      title: 'Doc',
      filePath: 'uploads/doc.pdf',
      owner: {
        id: 'u1',
        name: 'User',
        email: 'user@example.com',
        role: 'editor',
      },
    };

    docRepo.findOne.mockResolvedValue(doc);

    const result = await service.findById('1');

    expect(docRepo.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['owner'],
    });

    expect(result.title).toBe('Doc');
    expect(result.owner.email).toBe('user@example.com');
  });

  it('should throw NotFoundException if document not found', async () => {
    docRepo.findOne.mockResolvedValue(null);

    await expect(service.findById('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
