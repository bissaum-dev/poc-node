import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'poc-node',
      version: '0.0.1',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/app/**/*.ts'],
});

export const SwaggerMiddleware = (server: Express) =>
  server.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
