const express = require('express');
const productRouter = express.Router();
const productManager = require('../src/productManager');

productRouter.get('/', productManager.getAllProducts);
productRouter.get('/:pid', productManager.getProductById);
productRouter.post('/', productManager.addProduct);
productRouter.put('/:pid', productManager.updateProduct);
productRouter.delete('/:pid', productManager.deleteProduct);

module.exports = productRouter;
