const Cart = require('../dao/models/cart.model');
const Product = require('../dao/models/product.model');

const cartManager = {
  createCart: async (req, res, io) => {
    try {
      const newCart = req.body;

      if (!Array.isArray(newCart.products)) {
        return res.status(400).json({ message: 'La propiedad "products" debe ser un array' });
      }

      const createdCart = await Cart.create(newCart);

      res.json({ message: 'Carrito creado con éxito', cart: createdCart });
      io.emit('cartUpdated', createdCart);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },

  getCartById: async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await Cart.findOne({ cartId }).populate('products.productId');

      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  addProductToCart: async (req, res, io) => {
    try {
      const productId = req.params.pid;
      const cartId = req.params.cid;
      const quantity = req.body.quantity || 1;

      const cart = await Cart.findOne({ cartId });

      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      const product = await Product.findOne({ id: productId });

      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const existingProduct = cart.products.find(p => p.productId.toString() === product._id.toString());

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId: product._id, quantity });
      }

      const updatedCart = await cart.save();

      res.json({ message: 'Producto agregado al carrito con éxito', cart: updatedCart });
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },

  deleteProductFromCart: async (req, res, io) => {
    try {
      const productId = req.params.pid;
      const cartId = req.params.cid;

      const cart = await Cart.findOne({ cartId });

      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      cart.products = cart.products.filter(p => p.productId.toString() !== productId);

      const updatedCart = await cart.save();

      res.json({ message: 'Producto eliminado del carrito con éxito', cart: updatedCart });
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },

  updateCart: async (req, res, io) => {
    try {
      const cartId = req.params.cid;
      const newProducts = req.body.products;

      const cart = await Cart.findOne({ cartId });

      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      if (!Array.isArray(newProducts)) {
        return res.status(400).json({ message: 'La propiedad "products" debe ser un array' });
      }

      cart.products = newProducts;

      const updatedCart = await cart.save();

      res.json({ message: 'Carrito actualizado con éxito', cart: updatedCart });
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },

  updateProductQuantityInCart: async (req, res, io) => {
    try {
      const productId = req.params.pid;
      const cartId = req.params.cid;
      const newQuantity = req.body.quantity;

      const cart = await Cart.findOne({ cartId });

      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      const productToUpdate = cart.products.find(p => p.productId.toString() === productId);

      if (!productToUpdate) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
      }

      productToUpdate.quantity = newQuantity;

      const updatedCart = await cart.save();

      res.json({ message: 'Cantidad de producto actualizada en el carrito con éxito', cart: updatedCart });
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },

  deleteAllProductsFromCart: async (req, res, io) => {
    try {
      const cartId = req.params.cid;

      const cart = await Cart.findOne({ cartId });

      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      cart.products = [];

      const updatedCart = await cart.save();

      res.json({ message: 'Todos los productos eliminados del carrito con éxito', cart: updatedCart });
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },
};

module.exports = cartManager;

