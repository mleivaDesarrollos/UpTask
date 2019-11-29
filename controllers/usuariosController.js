const Usuario = require('../models/Usuarios');
const envioMail = require('../handlers/email');

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
        const usuario = await Usuario.create({email, password});
        // Convertimos el mail a base 64 para agregar privacidad
        const emailSecured = Buffer.from(email).toString('hex');
        // URL de confirmación de sitio
        const confirmarUrl = `${req.protocol}://${req.headers.host}/validar-cuenta/${emailSecured}`;
        // Aca iría la parte de envio de mail para solicitar validación
        await envioMail.enviar({
            archivo: 'validarCuenta',
            usuario,
            asunto: 'Activar cuenta en UpTask',
            confirmarUrl
        });
        // Redirijimos el sitio
        req.flash('correcto', 'Se ha enviado un correo a tu mail para activar tu cuenta.');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // Listamos los errores mapeandolós con req flash
        req.flash('error', error.errors.map(error => error.message));
        // Redirigimos el sitio hacia la creación de cuenta
        res.redirect('/crear-cuenta');
    }
}

exports.activarCuenta = async(req, res, next) => {
    // Recolectamos el mail recibido en hexadecimal
    const email = Buffer.from(req.params.email, 'hex').toString();
    // Buscamos un usuario con este mail
    const usuario = await Usuario.findOne({where : {email, activo: 0}});
    // Validamos si el usaurio fue encontrado
    if(!usuario) {
        // Preparamos un flash con el error
        req.flash('error', 'El email indicado no existe o existe y ya se encuentra activa.');
    } else {
        // Cambiamos el estado a activo
        usuario.activo = 1;
        // Guardamos los cambios en el usuario
        await usuario.save();
        // Disponemos de la pantalla de logueo informando que el ingreso fue correcto
        req.flash('correcto', 'La cuenta fue activada correctamente, ya puedes ingresar a UpTask');        
    }
    res.redirect('/iniciar-sesion');
}