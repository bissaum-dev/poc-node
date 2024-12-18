import request from 'supertest';
import express, { Express } from 'express';
import { BodyMiddleware } from '../body';

describe('BodyMiddleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    BodyMiddleware(app);

    app.post('/test', (req, res) => {
      res.status(200).json(req.body);
    });
  });

  it('should parse JSON request body correctly', async () => {
    const response = await request(app)
      .post('/test')
      .send({ key: 'value' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ key: 'value' });
  });

  it('should return 400 for invalid JSON', async () => {
    const response = await request(app)
      .post('/test')
      .send('invalid-json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });
});
