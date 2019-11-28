// Cargamos las librerías de uso
const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Proyectos = require('./Proyectos');


const Usuarios = db.define('usuarios', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Agrega un correo valido"
            },
            notEmpty: {
                msg: 'El mail no puede ir vacío'
            }
        },
        unique: {
            args: true, 
            msg: 'El correo indicado ya existe'
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede ir vacía'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: {
        type: Sequelize.STRING
    },
    expiracion: {
        type: Sequelize.DATE
    }
}, {
    hooks: {
            beforeCreate(usuario) {
            // Antes de registrar una contraseña en la base de datos utilizamos el método de bcrypt hashSync
            // Para que podamos proteger las claves de guardado en texto plano
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

Usuarios.prototype.verificarPassword = function(password_comparator) {
    return bcrypt.compareSync(password_comparator, this.password);
}

Usuarios.hasMany(Proyectos);

// Exportamos el modelo
module.exports = Usuarios;