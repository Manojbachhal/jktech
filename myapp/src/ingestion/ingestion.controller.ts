import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { ResponseWrapper } from '../common/utils/response-wrapper';

@Controller('api/auth/ingestion')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @Post('trigger')
  async triggerIngestion(): Promise<any> {
    try {
      const res = await this.ingestionService.trigger();
      return ResponseWrapper.Success(res);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
