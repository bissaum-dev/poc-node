import { Express } from 'express';
import { Log } from './log';
import { ApiEndpoints } from '../types';

const GET = (server: Express, endpoints: ApiEndpoints) => {
  Object.entries(endpoints).forEach((item) => {
    const [endpoint, handler] = item;
    server.get(endpoint, handler);
    Log.Muted('GET', endpoint);
  });
  return server;
};

const POST = (server: Express, endpoints: ApiEndpoints) => {
  Object.entries(endpoints).forEach((item) => {
    const [endpoint, handler] = item;
    server.post(endpoint, handler);
    Log.Muted('POST', endpoint);
  });
  return server;
};

const DELETE = (server: Express, endpoints: ApiEndpoints) => {
  Object.entries(endpoints).forEach((item) => {
    const [endpoint, handler] = item;
    server.delete(endpoint, handler);
    Log.Muted('DELETE', endpoint);
  });
  return server;
};

export const Endpoints = {
  GET,
  POST,
  DELETE,
};
