const Proyecto = require('../models/Proyectos');
const Tarea = require('../models/Tareas');

// Middleware que carga todos los proyectos
exports.listar = async (req, res, next) => {
    // Cargamos los proyectos
    const proyectos = await Proyecto.findAll();
    // Cargamos los proyecto en una variable local
    res.locals.proyectos = proyectos;
    // Continuamos con lo siguiente
    next();
}

// Disponemos el módulo de home
exports.home = (req, res) => {
    res.render('index', {
        nombrePagina: "Proyectos"
    })
}

// Formulario para nuevos proyectos
exports.formNuevo = (req, res) => {
    res.render('abmProyecto', {
        nombrePagina: "Nuevo Proyecto"
    })
}

// Accionador de nuevos proyectos
exports.nuevo = async (req, res) => {
    // Obtenemos el nombre del proyecto
    const {nombre} = req.body;
    // Validamos si se cargó un nombre
    if(!nombre){
        // Disponemos un mensaje de error
        req.flash('error', 'Es necesario indicar un nombre de proyecto');
        // Redireccionamos
        res.redirect('/nuevo-proyecto');
    } else {
        // Guardamos en la base de datos
        await Proyecto.create({nombre});
        // Redireccionamos
        res.redirect('/');
    }
}

exports.porUrl = async(req, res) => {
    // Separamos la URL del proyecto
    const {url} = req.params;
    // Buscamos el proyecto solicitado
    const proyecto = await Proyecto.findOne({where: {url}});
    // Validamos si el proyecto fue encontrado
    if(proyecto) {
        // Traemos todos las tareas vinculadas con este proyecto
        const tareas = await Tarea.findAll({where: {proyectoId: proyecto.id}})
        // Renderizamos la vista de proyecto
        res.render('tareas', {
            nombrePagina: `Tareas - ${proyecto.nombre}`,
            proyecto,
            tareas
        });
    }
}

// Muestreo de formulario para editar proyecto
exports.formEditar = async (req, res) => {
    // Separamos el ID del proyecto
    const {id} = req.params;
    // Obtenemos el proyecto
    const proyecto = await Proyecto.findOne({where:{ id }});
    // Validamos que exista
    if(proyecto) {
        // Redirigimos el sitio
        res.render('abmProyecto', { 
            nombrePagina: `Modificar Proyecto - ${proyecto.nombre}`,
            proyecto
        })
    }
}

exports.editar = async(req, res) => {
    // Separamos el Id
    const {id} = req.params;
    const {nombre} = req.body;
    // Buscamos el proyecto
    const proyecto = await Proyecto.findOne({where: {id}});
    // Validamos que exista el proyecto
    if(proyecto){
        // Cambiamos el valor
        proyecto.nombre = nombre;

        // Guardamos
        proyecto.save();

        // Redirigimos el sitio hacia la edición de proyecto
        res.redirect(`/proyectos/${proyecto.url}`);
    }
}

// Ruta para eliminar un proyecto de la base de datos
exports.eliminar = async (req, res, next) => {
    // Recolectamos la URL del proyecto a eliminar
    const {url} = req.params;
    // Destruimos el proyecto en cuestion
    await Proyecto.destroy({where: {url}});
    // Una vez eliminado redirigimos al home
    res.status(200).send("Se ha eliminado correctamente el proyecto");
}