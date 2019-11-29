// Cargamos la librería expres
const express = require('express');
const app = express();
// Cargamos las variables de entorno
require('dotenv').config({path: 'vars.env'});

// Cargamos dependencias
const router = require('./routes');
const db = require('./config/db');
const localMiddlewares = require('./middlewares');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');


// Cargamos las variables de entorno
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;

// Cargamos las bases de datos
require('./models/Proyectos');
require('./models/Tareas');

db.sync(() => {
    console.log("Base de datos sincronizada exitosamente");
})

// Disponemos de archivos estaticos
app.use('/', express.static('./public'));

// Configuramos el servidor
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({secret: "clave Secreta", saveUninitialized:false, resave:false}));
app.use(cookieParser());

app.use(flash());

// Cargamos la librería passport
app.use(passport.initialize());
app.use(passport.session());

app.use(localMiddlewares);

// Disponemos de las rutas
app.use('/', router);

// Corremos el servidor sobre el puerto indicado
app.listen(PORT, HOST,() => {
    console.log(`El servidor ${HOST} esta operando sobre el puerto ${PORT}`);
});
