const express = require('express');
const productRouter = express.Router();
const productManager = require('../manager/productManager');
const mongoose = require('mongoose');
const Product = require('../dao/models/product.model');

module.exports = (io) => {
  productRouter.get('/', productManager.getAllProducts);
  productRouter.get('/:pid', productManager.getProductById);
  productRouter.post('/', (req, res) => productManager.addProduct(req, res, io));
  productRouter.put('/:pid', productManager.updateProduct);
  productRouter.delete('/:pid', (req, res) => productManager.deleteProduct(req, res, io));

  return productRouter;
};
