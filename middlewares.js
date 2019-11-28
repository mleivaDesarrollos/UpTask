const helpers = require('./helpers');

module.exports = (req, res, next) => {    
    // Disponemos de la funcion para revisar información en sitio
    res.locals.vardump = helpers.vardump;
    // Cargamos flash para que pueda ser utilizad en motores de vistas
    res.locals.mensajes = req.flash();
    // Disponemos el año por si lo queremos utilizar en las vistas
    res.locals.year = new Date().getFullYear();
    // Disponemos del usuario
    res.locals.usuario = {...req.user} || null;
    // Continuamos la secuencia
    next();
}