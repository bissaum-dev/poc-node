import request from 'supertest';
import express, { Express } from 'express';
import { StaticMiddleware } from '../static';

describe('StaticMiddleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    StaticMiddleware(app);
  });

  it('should serve static files from the public directory', async () => {
    const response = await request(app).get('/__mocks__/static.mock.txt');
    expect(response.status).toBe(200);
  });

  it('should return 404 for files not found', async () => {
    const response = await request(app).get('/__mocks__/non-existent-file.txt');
    expect(response.status).toBe(404);
  });
});
