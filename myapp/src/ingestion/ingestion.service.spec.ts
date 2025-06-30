import { IngestionService } from './ingestion.service';
import { pythonBackend } from '../common/axios/backend.client';

jest.mock('../common/axios/backend.client', () => ({
  pythonBackend: {
    post: jest.fn(),
  },
}));

describe('IngestionService', () => {
  let service: IngestionService;

  beforeEach(() => {
    service = new IngestionService();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should call python backend with correct payload', async () => {
    const mockResponse = { data: { message: 'Triggered' } };
    (pythonBackend.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await service.trigger();

    expect(pythonBackend.post).toHaveBeenCalledWith(
      'end points ',
      expect.any(Object),
    );
    expect(result).toEqual(mockResponse.data);
  });
});
