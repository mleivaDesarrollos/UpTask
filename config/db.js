// Cargamos sequelize
const Sequelize = require('sequelize');
// Cargamos las variables de entorno
require('dotenv').config({path: 'vars.env'});

// Separamos las variables a utilizar
const DB_NAME = process.env.DB_NAME,
DB_USER = process.env.DB_USER,
DB_PASS = process.env.DB_PASS,
DB_HOST = process.env.DB_HOST,
DB_PORT = process.env.DB_PORT;

// Configuramos la base de datos
const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mariadb",
    define: {
        timestamps:false
    },
    pool: {
        min:0,
        max:5,
        acquire:30000,
        idle:10000
    }
});

// Exportamos la base de datos
module.exports = db;
