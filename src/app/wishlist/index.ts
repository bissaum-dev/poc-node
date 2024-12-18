import { Request, Response } from 'express';

const GET = (req: Request, res: Response) => {
  res.send('Hello World!');
};

const POST = (req: Request, res: Response) => {
  res.send('Hello World!');
};

const DELETE = (req: Request, res: Response) => {
  res.send('Hello World!');
};

export const Wishlist = {
  GET,
  POST,
  DELETE,
};
