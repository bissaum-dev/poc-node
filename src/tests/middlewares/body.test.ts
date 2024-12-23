import express, { Express } from 'express';
import request from 'supertest';
import { BodyMiddleware } from '@/middlewares/body';

describe('Body Middleware', () => {
  let app: Express;
  beforeEach(() => {
    app = express();
    BodyMiddleware(app);
    app.post('/test', (req, res) => {
      res.json(req.body);
    });
  });

  it('should parse JSON in the request body', async () => {
    const body = { key: 'value' };
    const response = await request(app).post('/test').send(body).expect(200);
    expect(response.body).toEqual(body);
  });

  it('should return error for invalid body', async () => {
    const response = await request(app)
      .post('/test')
      .set('Content-Type', 'application/json')
      .send('invalid-json')
      .expect(400);
    expect(response.text).toContain('Unexpected token');
  });
});
