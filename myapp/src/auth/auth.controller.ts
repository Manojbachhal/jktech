import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenericResponse } from '../common/utils/generic-reponse';
import { ResponseWrapper } from '../common/utils/response-wrapper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<GenericResponse<RegisterDto>> {
    try {
      const res = await this.authService.register(dto);
      return ResponseWrapper.Success(res.data, res.message);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<GenericResponse<{ access_token: string }>> {
    try {
      const res = await this.authService.login(dto);
      return ResponseWrapper.Success(res.data, res.message);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
