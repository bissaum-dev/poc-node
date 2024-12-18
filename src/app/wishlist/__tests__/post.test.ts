/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST } from '../post';
import { Request, Response } from 'express';
import { db } from '../../../utils/firebase';
import { ApiResponseStatus } from '../../../types';

jest.mock('../../../utils/firebase', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    get: jest.fn(),
  },
}));

describe('POST /addProductInWishlist', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: { id: '1' },
    };
    res = {
      json: jest.fn(),
    };
  });

  it('should return BAD_REQUEST if product ID is not provided', async () => {
    req.params.id = '';

    await POST(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.BAD_REQUEST,
      data: {
        message: 'Informe o id do produto a ser adicionado na lista de desejos',
      },
    });
  });

  it('should return NO_CONTENT if product does not exist', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({ exists: false });
    const mockDoc = jest.fn().mockReturnValue({ get: mockGet });
    const mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });

    db.collection = mockCollection;

    await POST(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.NO_CONTENT,
      data: {
        message:
          'O produto com esse id não existe para ser adicionado na lista de desejos',
      },
    });
  });

  it('should add the product to the wishlist successfully', async () => {
    const mockGetProduct = jest.fn().mockResolvedValueOnce({ exists: true });
    const mockGetWishlist = jest.fn().mockResolvedValueOnce({ empty: true });
    const mockAdd = jest.fn().mockResolvedValueOnce({ id: '123' });
    const mockDoc = jest.fn().mockReturnValue({ get: mockGetProduct });
    const mockWhere = jest.fn().mockReturnValue({ get: mockGetWishlist });

    const mockCollection = jest
      .fn()
      .mockReturnValueOnce({ doc: mockDoc })
      .mockReturnValueOnce({ where: mockWhere })
      .mockReturnValueOnce({ add: mockAdd });

    db.collection = mockCollection;

    await POST(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.CREATED,
      data: { productId: '123' },
    });
  });
});
