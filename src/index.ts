import express from 'express';
import { Middleware } from '@/middleware';
import { Endpoints } from '@/utils/endpoints';
import { Products } from '@/app/products';
import { Wishlist } from '@/app/wishlist';

const PORT = 3000;

let server = express();

server = Middleware.start(server);

server = Endpoints.GET(server, {
  '/product': Products.GET,
  '/wishlist': Wishlist.GET,
});

server = Endpoints.POST(server, {
  '/wishlist/:id': Wishlist.POST,
});

server = Endpoints.DELETE(server, {
  '/wishlist/:id': Wishlist.DELETE,
});

server = Middleware.end(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
