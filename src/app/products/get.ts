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
    /**
     * @swagger
     * /product:
     *   get:
     *     summary: Retorna a lista de produtos
     *     responses:
     *       204:
     *         description: Nenhum produto encontrado
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
      const message = 'Nenhum produto encontrado';
      Log.Warning(`GET ${status}`, req.url);
      res.json({ status, data: { message } } as ApiResponseError);
      return;
    }

    /**
     * @swagger
     * /product:
     *   get:
     *     summary: Retorna a lista de produtos
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
     *                       code:
     *                         type: string
     *                       name:
     *                         type: string
     *                       available:
     *                         type: boolean
     *                       visible:
     *                         type: boolean
     *                       details:
     *                         type: object
     *                         properties:
     *                           name:
     *                             type: string
     *                           description:
     *                             type: string
     *                       fullPriceInCents:
     *                         type: string
     *                       salePriceInCents:
     *                         type: string
     *                       rating:
     *                         type: number
     *                       image:
     *                         type: string
     *                       stockAvailable:
     *                         type: boolean
     *                 meta:
     *                   type: object
     *                   properties:
     *                     nextPage:
     *                       type: string
     */
    const status = ApiResponseStatus.OK;
    const data = query.docs.map((item) => ({ id: item.id, ...item.data() }));
    const meta = { nextPage: '/product?page=2' };
    Log.Success(`GET ${status}`, req.url);
    res.json({ status, data, meta } as ApiResponseSuccess<IResponse[]>);
  } catch (error) {
    Log.Fatal('GET', JSON.stringify(error));
  }
};
