/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import express from 'express';
import { Middleware } from '@/middleware';

jest.mock('@/middlewares/static', () => ({
  StaticMiddleware: jest.fn().mockImplementation((server: any) => server),
}));

jest.mock('@/middlewares/body', () => ({
  BodyMiddleware: jest.fn().mockImplementation((server: any) => server),
}));

jest.mock('@/middlewares/cors', () => ({
  CorsMiddleware: jest.fn().mockImplementation((server: any) => server),
}));

jest.mock('@/middlewares/errors', () => ({
  ServerMiddleware: jest.fn().mockImplementation((server: any) => server),
  ClientMiddleware: jest.fn().mockImplementation((server: any) => server),
}));

describe('Middleware tests', () => {
  let server: express.Express;

  beforeEach(() => {
    server = express();
  });

  it('should apply start middlewares correctly', async () => {
    Middleware.start(server);

    expect(
      require('@/middlewares/static').StaticMiddleware,
    ).toHaveBeenCalledWith(server);
    expect(require('@/middlewares/body').BodyMiddleware).toHaveBeenCalledWith(
      server,
    );
    expect(require('@/middlewares/cors').CorsMiddleware).toHaveBeenCalledWith(
      server,
    );
  });

  it('should apply end middlewares correctly', async () => {
    Middleware.end(server);

    expect(
      require('@/middlewares/errors').ServerMiddleware,
    ).toHaveBeenCalledWith(server);
    expect(
      require('@/middlewares/errors').ClientMiddleware,
    ).toHaveBeenCalledWith(server);
  });

  it('should respond correctly to a mock request', async () => {
    server.get('/test', (req, res) => {
      res.status(200).send('OK');
    });

    const response = await request(server).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
