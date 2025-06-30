import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { DocumentResponseDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private docRepo: Repository<Document>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async saveDocument(
    filePath: string,
    title: string,
    userId: string,
  ): Promise<DocumentResponseDto> {
    const user = await this.userRepo.findOneBy({ id: userId });

    const doc = this.docRepo.create({
      title,
      filePath,
      owner: user,
    });

    return await this.docRepo.save(doc);
  }

  async findAll({
    page,
    size,
    sort,
  }: {
    page?: string;
    size?: string;
    sort?: string;
  }): Promise<{
    data: DocumentResponseDto[];
    total: number;
    page: number;
    size: number;
    sort: string;
  }> {
    const shouldPaginate = page && size && !isNaN(+page) && !isNaN(+size);
    const skip = shouldPaginate ? (+page - 1) * +size : 0;
    const take = shouldPaginate ? +size : undefined;

    const [documents, total] = await this.docRepo.findAndCount({
      skip,
      take,
      order: {
        createdAt: sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      relations: ['owner'],
    });

    const mapped = documents.map((doc) => {
      const filename = doc.filePath.split(/[/\\]/).pop();
      const fileUrl = `http://localhost:3000/uploads/${filename}`;

      return {
        id: doc.id,
        title: doc.title,
        filePath: fileUrl,
        owner: {
          id: doc.owner.id,
          name: doc.owner.name,
          email: doc.owner.email,
          role: doc.owner.role,
        },
      };
    });

    return {
      data: mapped,
      total,
      page: shouldPaginate ? +page : 1,
      size: shouldPaginate ? +size : total,
      sort: sort ?? 'ASC',
    };
  }

  async findById(id: string): Promise<DocumentResponseDto> {
    const doc = await this.docRepo.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (doc === null || doc === undefined) {
      throw new NotFoundException('Document not found');
    }

    const fileUrl = doc.filePath;

    return {
      id: doc.id,
      title: doc.title,
      filePath: fileUrl,
      owner: {
        id: doc.owner.id,
        name: doc.owner.name,
        email: doc.owner.email,
        role: doc.owner.role,
      },
    };
  }
}
