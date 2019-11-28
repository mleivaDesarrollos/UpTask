// Cargamos las librerías de las cuales dependemos
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Cargamos el modelo de usuarios
const Usuario = require('../models/Usuarios');

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async(email, password, done) => {
        try {
            // Buscamos el usuario en la base de datos
            const usuario = await Usuario.findOne({where: {email}});
            // Vaidamos si la contraseña del usuario está cargada
            if(!usuario.verificarPassword(password)) {
                return done(null, false, {
                    message: "El password no es valido"
                });
            }
            // Llegando a esta instancia de la validación, el logueo es correcto
            return done(null, usuario);
        } catch (error) {
            return done(null, false, {
                message: "El usuario no fue encontrado"
            });
        }
    })
)
// Passport por algún motivo en particular necesita serializar y deserializar el usuario, averiguar luego por que
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});


module.exports = passport;