import request from 'supertest';
import express from 'express';
import { GET } from '@/app/products/get';
import { db } from '@/utils/firebase';
import { ApiResponseStatus } from '@/types';

const app = express();
app.get('/products', GET);

jest.mock('@/utils/firebase', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    get: jest.fn(),
  },
}));

jest.mock('@/utils/log', () => ({
  Log: {
    Warning: jest.fn(),
    Success: jest.fn(),
    Fatal: jest.fn(),
  },
}));

describe('GET /products', () => {
  it('should return status 200 and products found', async () => {
    const mockData = [
      {
        id: '1',
        data: () => ({
          code: 'P001',
          name: 'Produto 1',
          available: true,
          visible: true,
          details: {
            name: 'Detalhes Produto 1',
            description: 'Descrição do Produto 1',
          },
          fullPriceInCents: '10000',
          salePriceInCents: '9000',
          rating: 4.5,
          image: 'image1.jpg',
          stockAvailable: true,
        }),
      },
      {
        id: '2',
        data: () => ({
          code: 'P002',
          name: 'Produto 2',
          available: true,
          visible: true,
          details: {
            name: 'Detalhes Produto 2',
            description: 'Descrição do Produto 2',
          },
          fullPriceInCents: '20000',
          salePriceInCents: '18000',
          rating: 4.7,
          image: 'image2.jpg',
          stockAvailable: false,
        }),
      },
    ];

    (db.collection as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        empty: false,
        docs: mockData,
      }),
    });

    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(ApiResponseStatus.OK);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('name', 'Produto 1');
  });

  it('should return status 204 when no product is found', async () => {
    (db.collection as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        empty: true,
        docs: [],
      }),
    });

    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(ApiResponseStatus.NO_CONTENT);
    expect(response.body.data.message).toBe('Nenhum produto encontrado');
  });
});
