const Product = require('../dao/models/product.model');

const productManager = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener todos los productos' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await Product.findOne({ id: productId });

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el producto por ID' });
    }
  },

  addProduct: async (req, res, io) => {
    try {
      const newProduct = req.body;

      const createdProduct = await Product.create(newProduct);

      io.emit('productAdded', createdProduct);

      res.json({ message: 'Producto agregado con éxito', product: createdProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al agregar el producto' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.pid;

      const updatedProduct = await Product.findOneAndUpdate(
        { id: productId },
        { $set: req.body },
        { new: true }
      );

      if (updatedProduct) {
        io.emit('productUpdated', updatedProduct);

        res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el producto' });
    }
  },

  deleteProduct: async (req, res, io) => {
    try {
      const productId = req.params.pid;

      const deletedProduct = await Product.findOneAndDelete({ id: productId });

      if (deletedProduct) {
        io.emit('productDeleted', deletedProduct);

        res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el producto' });
    }
  },
};

module.exports = productManager;
