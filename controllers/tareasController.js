// Cargamos los modelos de proyecto y tarea
const Proyecto = require('../models/Proyectos');
const Tarea = require('../models/Tareas');

// Agregamos una tarea
exports.agregar = async (req, res, next) => {
    // Obtenemos el URL del proyecto
    const {url} = req.params;    
    // Obtenemos el proyecto vinculado
    const proyecto = await Proyecto.findOne({where: {url}});
    // Validamos si encontramos el proyecto
    if(proyecto){
        // Obtenemos el id del proyecto
        const proyectoId = proyecto.id;
        // Levantamos el body de la tarea
        const {tarea} = req.body;
        // Generamos solicitud de creación
        const resultado = await Tarea.create({tarea, proyectoId});
        // Si hay resultado significa que se cargo
        if(resultado) {
            // Redireccionamos el sitio al home
            res.redirect(`/proyectos/${url}`);
        }
    }
    // En caso de llegar aca, significa que no se encontró proyecto o que no se pudo guardar
    next();
}

// Cambiamos el estado del proyecto
exports.cambiarEstado = async(req, res, next) => {
    // Obtenemos el id del proyecto
    const {id} = req.params;
    // Consultamos a la base de datos para obtener la tarea
    const tarea = await Tarea.findOne({where: {id}});
    // Determinamos estados
    let estado = 0;
    // Validamos el estado
    if(tarea.estado === 0) {
        // Cambiamos el estado
        estado = 1;
    }
    // Cambiamos el estado de la tarea
    tarea.estado = estado;
    // Guardamos el cambio de tarea
    const resultado = await tarea.save();
    // Averiguamos el resultado
    if(!resultado) {
        res.status(500).send("No se ha podido guardar el registro.");
    }
    // Redireccionamos
    res.status(200).send('Estado cambiado correctamente');
}

exports.eliminar = async(req, res, next) => {
    // Recolectamos el id de la tarea
    const {id} = req.params;
    // Validamos el id
    if(!id){
        res.status(400).send("Es necesario indicar un ID de tarea para eliminar.");
    }
    // Ejecutamos la eliminación
    const resultado = await Tarea.destroy({where:{id}});
    // Validamos que haya salido correctamente
    if(!resultado) {
        res.status(500).send("Error al eliminar el registro");
    }
    // Informamos que el proceso ha salido correcto
    res.status(200).send('Se elimino la tarea correctamente.');
}
