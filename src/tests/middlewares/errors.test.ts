import request from 'supertest';
import express, { Express } from 'express';
import { ServerMiddleware, ClientMiddleware } from '@/middlewares/errors';
import { ApiResponseStatus } from '@/types';

jest.mock('@/utils/log', () => ({
  Log: {
    Fatal: jest.fn(),
    Warning: jest.fn(),
  },
}));

describe('Errors Middleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
  });

  describe('ServerMiddleware', () => {
    it('should handle server errors and respond with the correct message', async () => {
      app.use(() => {
        const error: Error & { status?: number } = new Error('Test error');
        error.status = ApiResponseStatus.INTERNAL_SERVER_ERROR;
        throw error;
      });
      ServerMiddleware(app);

      const response = await request(app).get('/test');
      expect(response.status).toBe(ApiResponseStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        status: ApiResponseStatus.INTERNAL_SERVER_ERROR,
        data: {
          message:
            'Opa! Algo deu errado no nosso sistema. Estamos trabalhando para resolver isso o mais rápido possível',
        },
      });
    });

    it('should use default error message for unknown statuses', async () => {
      app.use(() => {
        const error: Error & { status?: number } = new Error(
          'Unknown status error',
        );
        error.status = 999;
        throw error;
      });
      ServerMiddleware(app);

      const response = await request(app).get('/unknown');
      expect(response.status).toBe(999);
      expect(response.body).toEqual({
        status: 999,
        data: {
          message:
            'Ocorreu um erro inesperado, o serviço estará disponível em alguns minutos',
        },
      });
    });
  });

  describe('ClientMiddleware', () => {
    it('should handle 404 errors and respond with the correct message', async () => {
      ClientMiddleware(app);

      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(ApiResponseStatus.NOT_FOUND);
      expect(response.body).toEqual({
        status: ApiResponseStatus.NOT_FOUND,
        data: {
          message:
            'Não conseguimos encontrar o que você está procurando. Verifique o endereço acessado',
        },
      });
    });
  });
});
