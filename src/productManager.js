const fs = require('fs/promises');
const path = require('path');

const productsFilePath = path.join(__dirname, '../productos.json');

async function readProductsFile() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, devuelve un array vacío
    return [];
  }
}

async function writeProductsFile(products) {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

const productManager = {
  getAllProducts: async (req, res) => {
    const products = await readProductsFile();
    res.json(products);
  },

  getProductById: async (req, res) => {
    const products = await readProductsFile();
    const productId = req.params.pid;
    const product = products.find(p => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  },

  addProduct: async (req, res) => {
    const newProduct = req.body;
    const products = await readProductsFile();

    // Autogenera ID único
    newProduct.id = generateUniqueId(products);

    // Valida campos obligatorios
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price) {
      return res.status(400).json({ message: 'Campos obligatorios incompletos' });
    }

    products.push(newProduct);
    await writeProductsFile(products);

    res.json({ message: 'Producto agregado con éxito', product: newProduct });
  },

  updateProduct: async (req, res) => {
    const products = await readProductsFile();
    const productId = req.params.pid;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      // Actualiza el producto con los datos del body, excepto el id
      const updatedProduct = { ...products[productIndex], ...req.body, id: productId };
      products[productIndex] = updatedProduct;
      await writeProductsFile(products);
      res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  },

  deleteProduct: async (req, res) => {
    const products = await readProductsFile();
    const productId = req.params.pid;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      const deletedProduct = products.splice(productIndex, 1);
      await writeProductsFile(products);
      res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  },
};

function generateUniqueId(existingProducts) {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000).toString();
  } while (existingProducts.some(product => product.id === newId));
  return newId;
}

module.exports = productManager;