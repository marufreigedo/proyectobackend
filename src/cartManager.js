const fs = require('fs/promises');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../carrito.json');

async function readCartsFile() {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al leer el archivo de carritos: ${error.message}`);
    throw error; 
  }
}

async function writeCartsFile(carts) {
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error al escribir en el archivo de carritos: ${error.message}`);
    throw error; 
  }
}

const cartManager = {
  createCart: async (req, res) => {
    try {
      const newCart = req.body;

      if (!Array.isArray(newCart.products)) {
        return res.status(400).json({ message: 'La propiedad "products" debe ser un array' });
      }

      const carts = await readCartsFile();

      // Autogenerar ID único
      newCart.cartId = generateUniqueId(carts);

      carts.push(newCart);
      await writeCartsFile(carts);

      res.json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  getCartById: async (req, res) => {
    try {
      const carts = await readCartsFile();
      const cartId = req.params.cid;
      const cart = carts.find(c => c.cartId === cartId);

      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  addProductToCart: async (req, res) => {
    try {
      const productId = req.params.pid;
      const cartId = req.params.cid;

      if (!isValidProductId(productId) || !isValidCartId(cartId)) {
        return res.status(400).json({ message: 'ID de producto o carrito no válido' });
      }

      const carts = await readCartsFile();
      const cartIndex = carts.findIndex(c => c.cartId === cartId);

      if (cartIndex !== -1) {
        const productIndex = carts[cartIndex].products.findIndex(p => p.productId === productId);

        if (productIndex !== -1) {
          // Si el producto ya existe en el carrito, incrementa la cantidad
          carts[cartIndex].products[productIndex].quantity += 1;
        } else {
          // Si el producto no existe en el carrito, lo agrega
          carts[cartIndex].products.push({ productId, quantity: 1 });
        }

        await writeCartsFile(carts);
        res.json({ message: 'Producto agregado al carrito con éxito', cart: carts[cartIndex] });
      } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
};

function generateUniqueId(existingCarts) {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000).toString();
  } while (existingCarts.some(cart => cart.cartId === newId));
  return newId;
}

function isValidProductId(productId) {
  return true; 
}

function isValidCartId(cartId) {
  return true; 
}

module.exports = cartManager;