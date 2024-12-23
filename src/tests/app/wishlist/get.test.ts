import { Request, Response } from 'express';
import { GET } from '../../../../src/app/wishlist/get';
import { db } from '../../../utils/firebase';
import { ApiResponseStatus } from '../../../types';
import { Log } from '../../../utils/log';

jest.mock('../../../utils/firebase', () => ({
  db: {
    collection: jest.fn().mockReturnValue({
      get: jest.fn(),
    }),
  },
}));

jest.mock('../../../utils/log', () => ({
  Log: {
    Success: jest.fn(),
    Warning: jest.fn(),
    Fatal: jest.fn(),
  },
}));

describe('GET /wishlist', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      url: '/wishlist',
    };

    mockRes = {
      json: jest.fn(),
    };
  });

  it('should return status 204 if wishlist is empty', async () => {
    (db.collection as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({ empty: true }),
    });

    await GET(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.NO_CONTENT,
      data: { message: 'Nenhum produto foi adicionado na lista de desejos' },
    });
    expect(Log.Warning).toHaveBeenCalledWith(
      `GET ${ApiResponseStatus.NO_CONTENT}`,
      '/wishlist',
    );
  });

  it('should return status 200 with wishlist items', async () => {
    const mockData = [
      { id: '1', productId: 'product_1' },
      { id: '2', productId: 'product_2' },
    ];

    (db.collection as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        empty: false,
        docs: mockData.map((item) => ({
          id: item.id,
          data: () => item,
        })),
      }),
    });

    await GET(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.OK,
      data: mockData,
    });
    expect(Log.Success).toHaveBeenCalledWith(
      `GET ${ApiResponseStatus.OK}`,
      mockReq.url,
    );
  });

  it('should log failure in case of error', async () => {
    const error = new Error('Erro ao acessar o banco de dados');
    (db.collection as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockRejectedValueOnce(error),
    });

    await GET(mockReq as Request, mockRes as Response);

    expect(Log.Fatal).toHaveBeenCalledWith('GET', JSON.stringify(error));
  });
});
