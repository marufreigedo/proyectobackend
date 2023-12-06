const express = require('express');
const cartRouter = express.Router();
const cartManager = require('../manager/cartManager');

cartRouter.post('/', cartManager.createCart);
cartRouter.get('/:cid', cartManager.getCartById);
cartRouter.post('/:cid/product/:pid', cartManager.addProductToCart);

module.exports = cartRouter;