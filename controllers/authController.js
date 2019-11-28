const passport = require('../config/passport');


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
