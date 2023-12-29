const Product = require('../dao/models/product.model');

const productManager = {
  getAllProducts: async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query, category, availability } = req.query;

      const filter = {};
      if (query) {
        filter.$or = [
          { category: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } },
        ];
      }
      if (category) {
        filter.category = category;
      }
      if (availability !== undefined) {
        filter.availability = availability;
      }

      const sortOrder = sort === 'desc' ? -1 : 1;
      const products = await Product.find(filter)
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .sort({ price: sortOrder });

      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const result = {
        status: 'success',
        payload: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}` : null,
      };

      res.json(result);
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
