import request from 'supertest';
import express, { Express } from 'express';
import { Endpoints } from '@/utils/endpoints';
import { Log } from '@/utils/log';
import { ApiEndpoints } from '@/types';

jest.mock('@/utils/log', () => ({
  Log: {
    Muted: jest.fn(),
  },
}));

describe('Endpoints Utils', () => {
  let server: Express;

  beforeEach(() => {
    server = express();
    const endpoints: ApiEndpoints = {
      '/api/test': (req, res) => {
        res.status(200).send({ message: 'Test Endpoint' });
      },
    };
    Endpoints.GET(server, endpoints);
  });

  it('should register GET endpoint and respond with 200 status', async () => {
    const response = await request(server).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test Endpoint');
    expect(Log.Muted).toHaveBeenCalledWith('GET', '/api/test');
  });

  it('should handle POST requests correctly', async () => {
    const postEndpoints: ApiEndpoints = {
      '/api/post': (req, res) => {
        res.status(201).send({ message: 'Post Endpoint' });
      },
    };

    Endpoints.POST(server, postEndpoints);

    const response = await request(server).post('/api/post');
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Post Endpoint');
    expect(Log.Muted).toHaveBeenCalledWith('POST', '/api/post');
  });

  it('should handle DELETE requests correctly', async () => {
    const deleteEndpoints: ApiEndpoints = {
      '/api/delete': (_req, res) => {
        res.status(200).send({ message: 'Delete Endpoint' });
      },
    };

    Endpoints.DELETE(server, deleteEndpoints);

    const response = await request(server).delete('/api/delete');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Delete Endpoint');
    expect(Log.Muted).toHaveBeenCalledWith('DELETE', '/api/delete');
  });
});
