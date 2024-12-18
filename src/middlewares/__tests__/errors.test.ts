import request from 'supertest';
import express, { Express } from 'express';
import { ServerMiddleware, ClientMiddleware } from '../errors';
import { ApiResponseStatus } from '../../types';

jest.mock('../../utils/log', () => ({
  Log: {
    Fatal: jest.fn(),
    Warning: jest.fn(),
  },
}));

describe('Middleware Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    ServerMiddleware(app);
    ClientMiddleware(app);
  });

  describe('ClientMiddleware', () => {
    it('should return 404 for all unmatched routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(ApiResponseStatus.NOT_FOUND);
      expect(response.body.status).toBe(ApiResponseStatus.NOT_FOUND);
      expect(response.body.data.message).toBe(
        'Não conseguimos encontrar o que você está procurando. Verifique o endereço acessado',
      );
    });
  });
});
