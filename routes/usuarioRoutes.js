import  express  from 'express';
import { formularioLogin, formularioRegistro,registrarU,confirmar, recuperarPassword,resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js';

const router = express.Router();


//rutas de autenticación login, vista y petición
router.get("/login", formularioLogin);

//registro de usuarios nuevos vista y petición
router.get("/registro", formularioRegistro);
router.post("/registro", registrarU);
router.get("/confirmar/:token",confirmar);

//ruta para recuperar contraseña, vista y petición
router.get("/recuperar", recuperarPassword);
router.post("/recuperar", resetPassword);

// Almacena el nuevo password
router.get('/recuperar/:token', comprobarToken);
router.post('/recuperar/:token', nuevoPassword);

export default router;