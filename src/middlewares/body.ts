import express, { Express } from 'express';

export const BodyMiddleware = (server: Express) => server.use(express.json());
