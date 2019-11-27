const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyecto = require('./Proyectos');

// Definimos el modelo
const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING,
    estado: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    }    
});

// Establecemos relación
Tareas.belongsTo(Proyecto);

// Exportamos el modelo
module.exports = Tareas;