import z from 'zod';
import { Request, Response } from 'express';
import {
  ApiResponseError,
  ApiResponseStatus,
  ApiResponseSuccess,
} from '../../types';
import { db } from '../../utils/firebase';

interface IResponse {
  productId: string;
}

const productIdNotPassedInUrl = (id: string) => {
  const schema = z.string().nonempty();
  if (!id || !schema.safeParse(id)) {
    const status = ApiResponseStatus.BAD_REQUEST;
    const message =
      'Informe o id do produto a ser removido da lista de desejos';
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const productNonExistsById = async (id: string) => {
  const product = await db.collection('wishlist').doc(id).get();
  if (!id || !product.exists) {
    const status = ApiResponseStatus.NO_CONTENT;
    const message =
      'O produto com esse id não existe para ser removido da lista de desejos';
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const removeProductFromWishlist = async (id: string) => {
  const doc = db.collection('wishlist').doc(id);
  await doc.delete();
  const status = ApiResponseStatus.OK;
  return {
    status,
    data: { productId: doc.id },
  } as ApiResponseSuccess<IResponse>;
};

export const DELETE = async (req: Request, res: Response) => {
  const { id } = req.params;

  const rule1 = productIdNotPassedInUrl(id);
  if (rule1) {
    res.json(rule1);
    return;
  }

  const rule2 = await productNonExistsById(id);
  if (rule2) {
    res.json(rule2);
    return;
  }

  const success = await removeProductFromWishlist(id);
  res.json(success);
};