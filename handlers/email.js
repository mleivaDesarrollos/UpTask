const nodemailer = require('nodemailer');
const emailConfig = require('../config/email')
const htmlToText = require('html-to-text');
const juice = require('juice');
const pug = require('pug');
const util = require('util');

// Creamos objeto de transporte que servira para el envío de mails
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});


const generarHTML = (archivo, opciones={}) => {
    // Utilizando PUG hacemos render del archivo pasando las opciones por parametro, la sintaxis de llamado es bastante simple
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    // Utilizando juice convertimos los estilos del documento a formato de estilo en linea, que son necesarios para los envíos de mail
    return juice(html);    
}

exports.enviar = async(opciones) => {
    // Validamos que las opciones esten cargadas
    if(!opciones) {
        // Informamos el error
        let error = new Error("Se deben comunicar las opciones de envío");
        return error;
    }
    // Validamos que las opciones tenga como parametro el nombre del archivo
    if(!opciones.hasOwnProperty("archivo")) {
        // Cargamos el mensaje de error
        let error = new Error("Se debe comunicar un nombre de archivo de mail para renderizar");
        // El primer parametro es el error el segundo es la respuesta correcta
        return error;
    }
    // Generamos el html
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html)
    let detallesMail = {
        from: 'UpTask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.asunto,
        html: html,
        text: text
    };
    // Preparamos la promesa Disponiendo de un lado la función a utilizar como primer parametro de la función y el objeto como segundo
    const enviarMail = util.promisify(transport.sendMail, transport);
    // Usamos el llamado de la función recibiendo como primer parametro el objeto padre y las opciones en el segundo
    // Esto sería como llamar a la función sendMail y que el primer parametro que recibiría esta función se lo pasemos a la segunda de de CALL
    return enviarMail.call(transport, detallesMail);
} 

