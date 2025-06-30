import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Basedto } from '../../common/entities/base.dto';

export class UserDto extends Basedto {
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsNotEmpty()
  @Expose()
  email: string;

  @IsNotEmpty()
  @Expose()
  @Expose()
  role: string;
}

export class UserResponseDto {
  data: UserDto[];
  total: number;
  page: number;
  size: number;
  sort: string;
}
