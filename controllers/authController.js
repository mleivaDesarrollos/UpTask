const passport = require('../config/passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const emails = require('../handlers/email');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.esUsuarioAutenticado = (req, res, next) => {
    // Validamos que el usuario este logueado
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/iniciar-sesion');
    }
}

// Formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
    res.render('iniciarSesion');
}

// Ruta para el cierre de sesión
exports.cerrarSession = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

exports.formResetearPassword = (req, res) => {
    // Renderizamos el sitio
    res.render('reestablecer');
}

exports.enviarToken = async(req, res) => {
    // Recolectamos el mail que vendría en el form de la solicitud
    const {email} = req.body;
    // Validamos que el campo venga cargado
    if(!email) {
        req.flash('error', 'Es necesario indicar un mail');
        res.redirect('/reestablecer');
    }
    // Consultamos a la base de datos si existe un usuario con ese mail
    const usuario = await Usuarios.findOne({where : {email}});
    // Validamos que haya un usuario cargado con este mail
    if(!usuario) {
        req.flash('error', 'El mail indicado no está relacionado con ningún usuario');
        req.redirect('/reestablecer');
    }
    // Llegado a este punto, validamos que el email no está vacío y el usuario existe
    // Deberiamos generar un token y enviarlo a un mail
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    // Guardamos el usuario en la base de datos
    await usuario.save();
    // Generamos un URL de solicitud para el token
    const url = `${req.protocol}://${req.headers.host}/reestablecer/${usuario.token}`;
    // Usamos el método de envío de mails para disparar el reseteo
    await emails.enviar({
        usuario,
        asunto: 'Reseteo de contraseña de UpTask',
        archivo: 'reestablecer',
        resetUrl: url
    });
    // Una vez enviado el mail redirigimos al home e informamos que el proceso fue completado
    req.flash('correcto', 'Se ha enviado un token de reseteo de clave a tu mail.');
    res.redirect('/iniciar-sesion');
};

// Realizamos blanqueo de contraseña
exports.validarToken = async(req, res) => {
    // Recolectamos el token que viene en la url
    const {token} = req.params;
    // Validamos la existencia del usuario en la base de datos
    const usuario = Usuarios.findOne({where: { token }});
    // Validamos si encontramos el usuario
    if(usuario) {
        // Redirigimos la petición hacia la direción de blanqueo de contraseña
        res.render('resetPassword');
    } else {
        // Informamos el error
        req.flash('error', 'El token indicado no es valido');
        res.redirect('/reestablecer');
    }
}

exports.resetearClave = async(req, res) => {
    // Recolectamos el token de la petición
    const {token} = req.params;
    // Ejecutamos una validaación contra la base de datos para determinar si el token esta cargado y tiene validez
    const usuario = await Usuarios.findOne({where: {
        token,
        expiracion: {
            [Op.gte]: Date.now()
        }
    }});
    // Validamos la existencia de un usuario al pasar este punto
    if(!usuario) {
        // Se informa el error y se redirige el sitio al home
        req.flash('error', 'El token recibido no es valido');
        res.redirect('/reestablecer');
    }
    // Recolectamos la contraseña
    const {password} = req.body;
    // Cambiamos la contraseña
    usuario.password = usuario.hashearPassword(password);
    // Reseteamos token y expiracion
    usuario.token = null;
    usuario.expiracion = null;
    // Guardamos al usuario
    await usuario.save();
    // Redirigimos la petición del sitio
    req.flash('correcto', 'Se ha blanqueado la contraseña de manera correcta');
    res.redirect('/iniciar-sesion');
}