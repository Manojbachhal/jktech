import { GenericApiResponseOfFilter, GenericResponse } from './generic-reponse';

export class ResponseWrapper {
  static Success<T>(data: T, message = 'Success'): GenericResponse<T> {
    return {
      status: 1,
      message,
      data,
    };
  }

  static Paginated<T>({
    data,
    total,
    page,
    size,
    sort,
    message = 'Request was successful',
  }: {
    data: T;
    total: number;
    page: number;
    size: number;
    sort: any;
    message?: string;
  }): GenericApiResponseOfFilter<T> {
    return {
      status: 1,
      message,
      data: {
        items: data,
        total,
        page,
        size,
        sort,
      },
    };
  }

  static Failure<T = any>(
    message = 'Something went wrong',
    data?: T,
  ): GenericResponse<T> {
    return {
      status: 0,
      message,
      data: data ?? ({} as T),
    };
  }
}
