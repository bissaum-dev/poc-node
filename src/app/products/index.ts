import { Request, Response } from 'express';

const GET = (req: Request, res: Response) => {
  res.send('Hello World!');
};

export const Products = {
  GET,
};
