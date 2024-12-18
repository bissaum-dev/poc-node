import { Request, Response } from 'express';
import { db } from '../../../utils/firebase';
import { ApiResponseStatus } from '../../../types';
import { Log } from '../../../utils/log';
import { GET } from '../get';

jest.mock('../../../utils/firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('../../../utils/log', () => ({
  Log: {
    Warning: jest.fn(),
    Success: jest.fn(),
    Fatal: jest.fn(),
  },
}));

describe('GET /products', () => {
  const mockReq = {} as Request;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 204 if there are no products', async () => {
    (db.collection as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ empty: true }),
    });

    await GET(mockReq, mockRes as Response);

    expect(db.collection).toHaveBeenCalledWith('products');
    expect(mockRes.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.NO_CONTENT,
      data: { message: 'Nenhum produto encontrado' },
    });
    expect(Log.Warning).toHaveBeenCalledWith(
      'GET 204',
      'Nenhum produto encontrado',
    );
  });

  it('should return 200 and the products successfully', async () => {
    const mockDocs = [
      { id: '1', data: () => ({ name: 'Produto 1' }) },
      { id: '2', data: () => ({ name: 'Produto 2' }) },
    ];

    (db.collection as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ empty: false, docs: mockDocs }),
    });

    await GET(mockReq, mockRes as Response);

    expect(db.collection).toHaveBeenCalledWith('products');
    expect(mockRes.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.OK,
      data: [
        { id: '1', name: 'Produto 1' },
        { id: '2', name: 'Produto 2' },
      ],
    });
    expect(Log.Success).toHaveBeenCalledWith('GET 200', mockReq.url);
  });

  it('should catch errors and log them as failure', async () => {
    const error = new Error('Erro ao acessar o banco');
    (db.collection as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue(error),
    });

    await GET(mockReq, mockRes as Response);

    expect(Log.Fatal).toHaveBeenCalledWith('GET', JSON.stringify(error));
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});
