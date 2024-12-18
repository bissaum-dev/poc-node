import { Express } from 'express';
import { StaticMiddleware } from './middlewares/static';
import { BodyMiddleware } from './middlewares/body';
import { CorsMiddleware } from './middlewares/cors';
import { ClientMiddleware, ServerMiddleware } from './middlewares/errors';

const start = (server: Express) => {
  server = StaticMiddleware(server);
  server = BodyMiddleware(server);
  server = CorsMiddleware(server);
  return server;
};

const end = (server: Express) => {
  server = ServerMiddleware(server);
  server = ClientMiddleware(server);
  return server;
};

export const Middleware = {
  start,
  end,
};
