import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { UserDto, UserResponseDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll({
    page,
    size,
    sort,
  }: {
    page?: string;
    size?: string;
    sort?: string;
  }): Promise<UserResponseDto> {
    try {
      const shouldPaginate = page && size && !isNaN(+page) && !isNaN(+size);

      const queryOptions: any = {
        order: {
          createdAt: sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        },
      };

      if (shouldPaginate) {
        queryOptions.skip = (+page - 1) * +size;
        queryOptions.take = +size;
      }

      const [result, total] =
        await this.userRepository.findAndCount(queryOptions);

      const transformedData = plainToInstance(UserDto, result, {
        excludeExtraneousValues: true,
      });

      return {
        data: transformedData,
        total,
        page: shouldPaginate ? +page : 1,
        size: shouldPaginate ? +size : total,
        sort,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserDto> {
    try {
      let res = await this.userRepository.findOne({ where: { email } });
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
