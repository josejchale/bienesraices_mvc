import { check, validationResult } from "express-validator";
import modelUsuario from "../models/modelUsuario.js"
import { generarId } from "../helpers/tokens.js";

const formularioLogin = (req,res)=>{
        res.render('auth/login',{
        pagina: 'Iniciar Sesión',
    })
}

const formularioRegistro = (req,res)=>{
    res.render('auth/registro',{
        pagina: 'Crear Cuenta'
    })
}

const registrarU = async (req,res)=>{

    // Validación de campos llenos
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacío').run(req);
    await check('email').isEmail().withMessage('El email no es válido').run(req);
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    await check('repetirPassword').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);
        const {nombre, email, password} = req.body;

    // Si hay errores, renderizar la vista de registro con los errores
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        errores:resultado.array(),
        usuario:{
            nombre: nombre,
            email: email,
        }
    })
    }
    //verificar si el usuario ya existe
    const existeUsuario = await modelUsuario.findOne({
        where:{
            email
        }
    })
    if (existeUsuario){
        return res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        errores:[{msg: 'El usuario ya está registrado'}],
        usuario:{
            nombre: nombre,
            email: email,
        }
    })
    }

    //almacenar usuario en la base de datos
    await modelUsuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    })
    //mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        pagina:'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un Email de confirmación, revisa tu bandeja de entrada o spam',
    })
}

const recuperarPassword = (req,res)=>{
    res.render('auth/recuperar',{
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrarU,
    recuperarPassword
}