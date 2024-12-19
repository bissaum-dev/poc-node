import cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';
import type { CorsOptions } from 'cors';

const AllowedDomains = [/localhost/, /\.railway\.app$/];

export const corsOptions = (): CorsOptions => {
  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = AllowedDomains.some((domain) => domain.test(origin));
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  };
};

export const CorsMiddleware = (server: Express) => {
  server.use(cors(corsOptions()));

  server.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
      res.status(403).send('Acesso não permitido pelo CORS');
    } else {
      next(err);
    }
  });

  return server;
};
