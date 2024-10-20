import express from 'express';
import methodOverride from "method-override";
import handlebars from 'express-handlebars';
import mongoose from "mongoose";

//Importar archivo utils que me soluciona la creación del path
import __dirname from './utils.js';

//Importar dotenv para utilizar las varliables de entorno
import dotenv from "dotenv";

//Importar los routers
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';

//Inicializo la constante app para utilizar express
const app = express();

//configurar para trabajar con json 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config(); //nos permitia poder trabjar con las variables de entorno

//Leer y almacenar variables de entorno
const URIConexion = process.env.URIMONGO;

//Conexión a la base de datos
mongoose.connect(URIConexion)
    .then( () => console.log(''))
    .catch((error) => console.error('Error en conexion:', error))
;

//Para poder reescribir e interpretar el valor del campo _method de un formulario
app.use(methodOverride('_method'));

//Inicializar el motor indicando app.engine
app.engine('handlebars', handlebars.engine());

/**
 * con app.set('views',ruta) Indicamos en qué parte dle proyecto van a estar las vistas
 * Recuerda utilizar rutas absolutas para indicar y evitar asuntos de ruteo relativo
 */
app.set('views', __dirname + '/views');

app.set('view engine', 'handlebars');

//Seteo de manera estática la carpeta public
app.use(express.static(__dirname+'/public'));

app.use('/product', productRouter);
app.use('/cart', cartRouter);

app.get('/newProduct', (req, res) =>{
    res.render('newProduct');
})

const server = app.listen(8080, ()=> {
    console.log("Listening on PORT 8080")
});