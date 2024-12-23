import { Request, Response } from 'express';
import { db } from '@/utils/firebase';
import {
  ApiResponseStatus,
  ApiResponseError,
  ApiResponseSuccess,
} from '@/types';
import { Log } from '@/utils/log';

interface IResponse {
  id: string;
  code: string;
  name: string;
  available: boolean;
  visible: boolean;
  details: {
    name: string;
    description: string;
  };
  fullPriceInCents: string;
  salePriceInCents: string;
  rating: number;
  image: string;
  stockAvailable: boolean;
}

export const GET = async (req: Request, res: Response) => {
  try {
    const query = await db.collection('products').get();

    if (query.empty) {
      const status = ApiResponseStatus.NO_CONTENT;
      const message = 'Nenhum produto encontrado';
      Log.Warning(`GET ${status}`, req.url);
      res.json({ status, data: { message } } as ApiResponseError);
      return;
    }

    const status = ApiResponseStatus.OK;
    const data = query.docs.map((item) => ({ id: item.id, ...item.data() }));
    Log.Success(`GET ${status}`, req.url);
    res.json({ status, data } as ApiResponseSuccess<IResponse[]>);
  } catch (error) {
    Log.Fatal('GET', JSON.stringify(error));
  }
};
