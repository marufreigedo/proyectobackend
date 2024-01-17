const bcrypt = require('bcrypt');
const User = require('../dao/models/user.model');
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
    // Función para obtener un carrito por ID
  },

  addProductToCart: async (req, res, io) => {
    // Función para agregar un producto al carrito
  },

  deleteProductFromCart: async (req, res, io) => {
    // Función para eliminar un producto del carrito
  },

  updateCart: async (req, res, io) => {
    // Función para actualizar el carrito
  },

  updateProductQuantityInCart: async (req, res, io) => {
    // Función para actualizar la cantidad de un producto en el carrito
  },

  deleteAllProductsFromCart: async (req, res, io) => {
    // Función para eliminar todos los productos del carrito
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user && (await user.comparePassword(password))) {
        req.session.user = user;

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
          user.role = 'admin';
          await user.save();
        } else {
          user.role = 'usuario';
          await user.save();
        }

        res.json({ message: 'Inicio de sesión exitoso', user });
      } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });
      res.json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  },
};

module.exports = cartManager;
