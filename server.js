const express = require('express');
const productRouter = require('./routes/product.route');
const cartRouter = require('./routes/cart.route');

const app = express();
const PORT = 8080;

app.use(express.json());


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
