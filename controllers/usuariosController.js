const Usuario = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    // Preparamos la solicitud de generación de vista
    res.render('nuevoUsuario');
}

exports.crearCuenta = async (req, res, next) => {
    // De la solicitud recolectamos el email y el password
    const {email, password} = req.body;
    // disponemos toda la consulta en un bloque try catch
    try {
        // Intentamos hacer la carga sobre la base de datos
        await Usuario.create({email, password});
        // Aca iría la parte de envio de mail para solicitar validación

        // Redirijimos el sitio
        req.flash('correcto', 'Se ha creado cuenta correctamente');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // Listamos los errores mapeandolós con req flash
        req.flash('error', error.errors.map(error => error.message));
        // Redirigimos el sitio hacia la creación de cuenta
        res.redirect('/crear-cuenta');
    }
}