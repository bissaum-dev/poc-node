import request from 'supertest';
import express from 'express';
import { Middleware } from '@/middleware';
import { Endpoints } from '@/utils/endpoints';
import { Products } from '@/app/products';
import { Wishlist } from '@/app/wishlist';

describe('API Routes', () => {
  let server: express.Express;

  beforeAll(() => {
    server = express();
    server = Middleware.start(server);

    server = Endpoints.GET(server, {
      '/product': Products.GET,
      '/wishlist': Wishlist.GET,
    });

    server = Endpoints.POST(server, {
      '/wishlist/:id': Wishlist.POST,
    });

    server = Endpoints.DELETE(server, {
      '/wishlist/:id': Wishlist.DELETE,
    });

    server = Middleware.end(server);
  });

  test('GET /product should return products', async () => {
    const response = await request(server).get('/product');
    expect(response.body.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('GET /wishlist should return wishlist', async () => {
    const response = await request(server).get('/wishlist');
    expect(response.body.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('POST /wishlist/:id should add item to wishlist', async () => {
    const id = '123';
    const response = await request(server)
      .post(`/wishlist/${id}`)
      .send({ name: 'New Item' });
    expect(response.body.status).toBe(204);
    expect(response.body).toBeDefined();
  });

  test('DELETE /wishlist/:id should remove item from wishlist', async () => {
    const id = '123';
    const response = await request(server).delete(`/wishlist/${id}`);
    expect(response.body.status).toBe(204);
  });
});
