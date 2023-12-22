const Cart = require('../dao/models/models/cart.model');

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
      const cart = await Cart.findOne({ cartId });

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

      const cart = await Cart.findOne({ cartId });

      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      const productIndex = cart.products.findIndex(p => p.productId === productId);

      if (productIndex !== -1) {
        
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      const updatedCart = await cart.save();

      res.json({ message: 'Producto agregado al carrito con éxito', cart: updatedCart });
      io.emit('cartUpdated', updatedCart);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },
};

module.exports = cartManager;
