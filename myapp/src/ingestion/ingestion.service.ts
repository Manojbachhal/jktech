import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { lastValueFrom } from 'rxjs';
import { pythonBackend } from '../common/axios/backend.client';

@Injectable()
export class IngestionService {
  constructor() {}

  async trigger() {
    const response = await pythonBackend.post('end points ', {
      // payload if we want to pass any
      timestamp: new Date(),
    });

    return response.data;
  }
}
