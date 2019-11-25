// Cargamos la librería express
const express = require('express');
const router = express.Router();
const {body} = require("express-validator");


// Cargamos los controladores
const proyectosController = require('../controllers/proyectosController');

// Cargamos todos los proyectos usando el middleware correspondiente
router.use(proyectosController.listar);
// Cargamos las rutas
router.get('/', proyectosController.home);

// Rutas para generación de nuevo proyecto
router.get('/nuevo-proyecto', proyectosController.formNuevo);
router.post('/nuevo-proyecto',body("nombre").not().isEmpty().trim().escape(), proyectosController.nuevo);

// Rutas para consulta de proyecto
router.get('/proyectos/:url', proyectosController.porUrl);

// Rutas para editar el proyecto
router.get('/proyectos/editar/:id', proyectosController.formEditar);
router.post('/proyectos/editar/:id', proyectosController.editar);

// Rutas para eliminar el proyecto
router.delete('/proyectos/:url', (req, res) => { res.status(401).send("ok");});

// Exportamos el modelo
module.exports = router;