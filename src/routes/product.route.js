const express = require('express');
const productRouter = express.Router();
const productManager = require('../manager/productManager');

module.exports = (io) => {
  productRouter.get('/', productManager.getAllProducts);
  productRouter.get('/:pid', productManager.getProductById);
  productRouter.post('/', (req, res) => productManager.addProduct(req, res, io));
  productRouter.put('/:pid', productManager.updateProduct);
  productRouter.delete('/:pid', (req, res) => productManager.deleteProduct(req, res, io));

  return productRouter;
};
