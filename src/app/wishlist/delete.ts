import z from 'zod';
import { Request, Response } from 'express';
import {
  ApiResponseError,
  ApiResponseStatus,
  ApiResponseSuccess,
} from '@/types';
import { db } from '@/utils/firebase';
import { Log } from '@/utils/log';

interface IResponse {
  productId: string;
}

/**
 * @swagger
 * /wishlist/:id:
 *   delete:
 *     summary: Remove um produto da lista de desejos
 *     responses:
 *       400:
 *         description: Informe o id do produto a ser removido da lista de desejos
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
const productIdNotPassedInUrl = (id: string, url: string) => {
  const schema = z.string().nonempty();
  if (!id || !schema.safeParse(id)) {
    const status = ApiResponseStatus.BAD_REQUEST;
    const message =
      'Informe o id do produto a ser removido da lista de desejos';
    Log.Warning(`DELETE ${status}`, url);
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

/**
 * @swagger
 * /wishlist/:id:
 *   delete:
 *     summary: Remove um produto da lista de desejos
 *     responses:
 *       204:
 *         description: O produto com esse id não existe na lista de desejos
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
const productNonExistsById = async (id: string, url: string) => {
  const product = await db.collection('wishlist').doc(id).get();
  if (!id || !product.exists) {
    const status = ApiResponseStatus.NO_CONTENT;
    const message = 'O produto com esse id não existe na lista de desejos';
    Log.Warning(`DELETE ${status}`, url);
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

/**
 * @swagger
 * /wishlist/:id:
 *   delete:
 *     summary: Remove um produto da lista de desejos
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
 *                   type: object
 *                   properties:
 *                     idProduct:
 *                       type: string
 */
const removeProductFromWishlist = async (id: string, url: string) => {
  const doc = db.collection('wishlist').doc(id);
  await doc.delete();
  const status = ApiResponseStatus.OK;
  Log.Success(`DELETE ${status}`, url);
  return {
    status,
    data: { productId: doc.id },
  } as ApiResponseSuccess<IResponse>;
};

export const DELETE = async (req: Request, res: Response) => {
  const { id } = req.params;

  const rule1 = productIdNotPassedInUrl(id, req.url);
  if (rule1) {
    res.json(rule1);
    return;
  }

  const rule2 = await productNonExistsById(id, req.url);
  if (rule2) {
    res.json(rule2);
    return;
  }

  const success = await removeProductFromWishlist(id, req.url);
  res.json(success);
};
