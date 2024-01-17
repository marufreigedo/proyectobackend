const express = require('express');
const router = express.Router();
const cartManager = require('../manager/cartManager');

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register'); 
});


router.post('/register', cartManager.registerUser);

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login'); 
});

// Ruta para procesar el formulario de inicio de sesión
router.post('/login', cartManager.loginUser);

module.exports = router;
