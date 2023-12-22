const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const mongoose = require('../src/dao'); 
const productRouter = require('./routes/product.route');
const cartRouter = require('./routes/cart.route');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 8080;

app.use(express.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.use('/api/products', productRouter(io));
app.use('/api/carts', cartRouter);


app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
