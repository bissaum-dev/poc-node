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
      'Informe o id do produto a ser adicionado na lista de desejos';
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const productNonExistsById = async (id: string) => {
  const product = await db.collection('products').doc(id).get();
  if (!id || !product.exists) {
    const status = ApiResponseStatus.NO_CONTENT;
    const message =
      'O produto com esse id não existe para ser adicionado na lista de desejos';
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const productAlreadyInWishlist = async (id: string) => {
  const wishlist = await db
    .collection('wishlist')
    .where('productId', '==', id)
    .get();
  if (!id || !wishlist.empty) {
    const status = ApiResponseStatus.CONFLICT;
    const message = 'O produto já foi adicionado na lista de desejos';
    return { status, data: { message } } as ApiResponseError;
  }
  return false;
};

const addProductInWishlist = async (id: string) => {
  const doc = await db.collection('wishlist').add({ productId: id });
  const status = ApiResponseStatus.CREATED;
  return {
    status,
    data: { productId: doc.id },
  } as ApiResponseSuccess<IResponse>;
};

export const POST = async (req: Request, res: Response) => {
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

  const rule3 = await productAlreadyInWishlist(id);
  if (rule3) {
    res.json(rule3);
    return;
  }

  const success = await addProductInWishlist(id);
  res.json(success);
};
