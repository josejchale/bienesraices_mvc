import  express  from 'express';
import { formularioLogin, autenticar, formularioRegistro,registrarU,confirmar, recuperarPassword,resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js';

const router = express.Router();


//rutas de autenticación login, vista y petición
router.get("/login", formularioLogin);
router.post("/login", autenticar);

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