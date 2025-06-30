import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { CustomFileInterceptor } from '../common/intercepters/file.interceptor';
import {
  GenericApiResponseOfFilter,
  GenericResponse,
} from '../common/utils/generic-reponse';
import { ResponseWrapper } from '../common/utils/response-wrapper';
import { DocumentsService } from './documents.service';
import { DocumentResponseDto } from './dto/document.dto';

@ApiTags('Documents')
@Controller('api/auth/documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async getDocuments(
    @Query('page') page?: string,
    @Query('size') size?: string,
    @Query('sort') sort?: string,
  ): Promise<GenericApiResponseOfFilter<DocumentResponseDto[]>> {
    try {
      const result = await this.documentsService.findAll({ page, size, sort });

      return ResponseWrapper.Paginated({
        data: result.data,
        total: result.total,
        page: result.page,
        size: result.size,
        sort: result.sort,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const document = await this.documentsService.findById(id);

    const rawPath = document.filePath.replace(/\\/g, '/');
    const filename = rawPath.split('/').pop();
    if (!filename) throw new NotFoundException('File name not found');

    const filePath = join(process.cwd(), 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on server');
    }

    return res.download(filePath, filename);
  }

  @Post('upload')
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseInterceptors(CustomFileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Req() req,
  ): Promise<GenericResponse<DocumentResponseDto>> {
    try {
      const user = req.user;
      const filePath = file.path.split(' ').join('');
      const savedDoc = await this.documentsService.saveDocument(
        filePath,
        title,
        user.userId,
      );
      return ResponseWrapper.Success<DocumentResponseDto>(savedDoc);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
