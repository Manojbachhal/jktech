import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class Basedto {
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsNotEmpty()
  @Expose()
  createdAt: string;

  @IsNotEmpty()
  @Expose()
  @Expose()
  updatedAt: string;
}
