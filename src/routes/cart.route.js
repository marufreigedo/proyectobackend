const express = require('express');
const cartRouter = express.Router();
const cartManager = require('../manager/cartManager');

cartRouter.post('/login', cartManager.loginUser);
cartRouter.post('/register', cartManager.registerUser);
cartRouter.post('/', cartManager.createCart);
cartRouter.get('/:cid', cartManager.getCartById);
cartRouter.post('/:cid/products/:pid', cartManager.addProductToCart);
cartRouter.delete('/:cid/products/:pid', cartManager.deleteProductFromCart);
cartRouter.put('/:cid', cartManager.updateCart);
cartRouter.put('/:cid/products/:pid', cartManager.updateProductQuantityInCart);
cartRouter.delete('/:cid', cartManager.deleteAllProductsFromCart);

module.exports = cartRouter;
