// Cargamos la librería express
const express = require('express');
const router = express.Router();
const {body} = require("express-validator");

// Cargamos los controladores
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');

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
router.delete('/proyectos/:url', proyectosController.eliminar);

// Rutas para agregar una tarea a un proyecto
router.post('/proyectos/:url', tareasController.agregar);

// Rutas para tareas
router.post('/tareas/:id', tareasController.cambiarEstado);
router.delete('/tareas/:id', tareasController.eliminar);

// Exportamos el modelo
module.exports = router;