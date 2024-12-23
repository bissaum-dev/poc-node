/* eslint-disable @typescript-eslint/no-explicit-any */
import { DELETE } from '../../../app/wishlist/delete';
import { db } from '../../../utils/firebase';
import { ApiResponseStatus } from '../../../types';

jest.mock('../../../utils/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        delete: jest.fn(),
        id: 'mockedId',
      })),
    })),
  },
}));

describe('DELETE /wishlist/:id', () => {
  let req: any;
  let res: any;
  let mockGet: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockDelete = jest.fn();

    req = {
      params: { id: '' },
    };

    res = {
      json: jest.fn(),
    };

    (db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn(() => ({
        get: mockGet,
        delete: mockDelete,
        id: 'mockedId',
      })),
    });
  });

  it('should return BAD_REQUEST if productId is not provided', async () => {
    req.params.id = '';

    await DELETE(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.BAD_REQUEST,
      data: {
        message: 'Informe o id do produto a ser removido da lista de desejos',
      },
    });

    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should return NO_CONTENT if product does not exist', async () => {
    req.params.id = 'nonexistentId';
    mockGet.mockResolvedValue({ exists: false });

    await DELETE(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.NO_CONTENT,
      data: {
        message: 'O produto com esse id não existe na lista de desejos',
      },
    });
  });

  it('should return OK if product is successfully deleted', async () => {
    req.params.id = 'existingId';
    mockGet.mockResolvedValue({ exists: true });
    mockDelete.mockResolvedValue(undefined);

    await DELETE(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: ApiResponseStatus.OK,
      data: { productId: 'mockedId' },
    });
  });
});
