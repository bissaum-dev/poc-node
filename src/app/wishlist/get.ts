import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import {
  ApiResponseStatus,
  ApiResponseError,
  ApiResponseSuccess,
} from '../../types';
import { Log } from '../../utils/log';

interface IResponse {
  id: string;
  productId: string;
}

export const GET = async (req: Request, res: Response) => {
  try {
    const query = await db.collection('wishlist').get();

    if (query.empty) {
      const status = ApiResponseStatus.NO_CONTENT;
      const message = 'Nenhum produto foi adicionado na lista de desejos';
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
