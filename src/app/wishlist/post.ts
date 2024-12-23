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

const productIdNotPassedInUrl = (id: string, url: string) => {
  const schema = z.string().nonempty();
  if (!id || !schema.safeParse(id)) {
    const status = ApiResponseStatus.BAD_REQUEST;
    const message =
      'Informe o id do produto a ser adicionado na lista de desejos';
    Log.Warning(`POST ${status}`, url);
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const productNonExistsById = async (id: string, url: string) => {
  const product = await db.collection('products').doc(id).get();
  if (!id || !product.exists) {
    const status = ApiResponseStatus.NO_CONTENT;
    const message =
      'O produto com esse id não existe para ser adicionado na lista de desejos';
    Log.Warning(`POST ${status}`, url);
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const productAlreadyInWishlist = async (id: string, url: string) => {
  const wishlist = await db
    .collection('wishlist')
    .where('productId', '==', id)
    .get();
  if (!id || !wishlist.empty) {
    const status = ApiResponseStatus.CONFLICT;
    const message = 'O produto já foi adicionado na lista de desejos';
    Log.Warning(`POST ${status}`, url);
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const addProductInWishlist = async (id: string, url: string) => {
  const doc = await db.collection('wishlist').add({ productId: id });
  const status = ApiResponseStatus.CREATED;
  Log.Success(`POST ${status}`, url);
  return {
    status,
    data: { productId: doc.id },
  } as ApiResponseSuccess<IResponse>;
};

export const POST = async (req: Request, res: Response) => {
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

  const rule3 = await productAlreadyInWishlist(id, req.url);
  if (rule3) {
    res.json(rule3);
    return;
  }

  const success = await addProductInWishlist(id, req.url);
  res.json(success);
};
