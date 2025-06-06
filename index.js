import express from "express"
import usuarioRoutes from './routes/usuarioRoutes.js'
//crear la app
const app = express()

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

app.use("/auth", usuarioRoutes)


const port = 3000;



app.listen(port,()=>{
    console.log(`El servidor está funcionando en el puerto ${port}`)
})