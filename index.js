import express from "express"
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from "./config/db.js"

//crear la app
const app = express()

//habilitar lectura del body
app.use(express.urlencoded({extended:true}))

//conexión a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Conexión a la base de datos exitosa');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public'))

app.use("/auth", usuarioRoutes)


const port = 3000;



app.listen(port, () => {
    console.log(`✨🎉El servidor está funcionando en: http://localhost:${port}/auth/login 🚀🎊`);
});