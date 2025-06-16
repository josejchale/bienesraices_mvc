import  express  from 'express';
import { formularioLogin, formularioRegistro,registrarU, recuperarPassword } from '../controllers/usuarioController.js';

const router = express.Router();


//rutas de autenticación login, vista y petición
router.get("/login", formularioLogin);

//registro de usuarios nuevos vista y petición
router.get("/registro", formularioRegistro);
router.post("/registro", registrarU);

//ruta para recuperar contraseña, vista y petición
router.get("/recuperar", recuperarPassword)

export default router;