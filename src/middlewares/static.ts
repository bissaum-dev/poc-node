import express, { Express } from 'express';

export const StaticMiddleware = (server: Express) =>
  server.use('/', express.static('public'));
