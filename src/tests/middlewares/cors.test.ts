import request from 'supertest';
import express from 'express';
import { CorsMiddleware } from '@/middlewares/cors';

describe('CORS Middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    CorsMiddleware(app);
    app.get('/test', (_req, res) => {
      res.status(200).send('Success');
    });
  });

  it('should allow requests from permitted origins', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:3000');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Success');
  });

  it('should block requests from non-permitted origins', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://unauthorized-domain.com');
    expect(response.status).toBe(403);
    expect(response.text).toBe('Acesso não permitido pelo CORS');
  });

  it('should allow requests with no origin (local requests)', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Success');
  });
});
