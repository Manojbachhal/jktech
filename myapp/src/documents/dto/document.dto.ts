import { UserDto } from '../../user/dto/user.dto';

export class DocumentResponseDto {
  id: string;
  title: string;
  filePath: string;
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
