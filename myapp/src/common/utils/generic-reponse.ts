export type GenericResponse<T> = {
  status: number;
  message?: string;
  data: T;
};

export type GenericApiResponseOfFilter<T> = {
  status: number;
  message?: string;
  data: {
    items: T;
    total: number;
    page: number;
    size: number;
    sort?: any;
  };
};
