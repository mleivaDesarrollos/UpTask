// Cargamos la librería sequelize
const Sequelize = require('sequelize');
const db = require('../config/db');
const shortid = require('shortid');
const slug = require('slug');

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            // Preparamos el URL
            const url = slug(proyecto.nombre);
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

// Exportamos el módulo
module.exports = Proyectos;