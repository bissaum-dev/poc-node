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
  productId: string;
}

export const GET = async (req: Request, res: Response) => {
  try {
    const query = await db.collection('wishlist').get();

    /**
     * @swagger
     * /wishlist:
     *   get:
     *     summary: Retorna a lista de desejos
     *     responses:
     *       204:
     *         description: Nenhum produto foi adicionado na lista de desejos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: number
     *                 data:
     *                   type: object
     *                   properties:
     *                     message:
     *                       type: string
     */
    if (query.empty) {
      const status = ApiResponseStatus.NO_CONTENT;
      const message = 'Nenhum produto foi adicionado na lista de desejos';
      Log.Warning(`GET ${status}`, req.url);
      res.json({ status, data: { message } } as ApiResponseError);
      return;
    }

    /**
     * @swagger
     * /wishlist:
     *   get:
     *     summary: Retorna a lista de desejos
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: number
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                       productId:
     *                         type: string
     */
    const status = ApiResponseStatus.OK;
    const data = query.docs.map((item) => ({ id: item.id, ...item.data() }));
    Log.Success(`GET ${status}`, req.url);
    res.json({ status, data } as ApiResponseSuccess<IResponse[]>);
  } catch (error) {
    Log.Fatal('GET', JSON.stringify(error));
  }
};
