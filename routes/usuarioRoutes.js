import  express  from 'express';
import { formularioLogin, formularioRegistro, recuperarPassword } from '../models/usuarioController.js';

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.get("/recuperar", recuperarPassword)

export default router;