import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import modelUsuario from "../models/modelUsuario.js"
import { generarId } from "../helpers/tokens.js";
import { emailRegistro, emailRecuperar } from "../helpers/emails.js";

const formularioLogin = (req,res)=>{
        res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        csrfToken:req.csrfToken(),
        
        
    })
}

const autenticar = async (req,res)=>{

    // Validación de campos llenos
    await check('email').isEmail().withMessage('Esto no parece un E-mail').run(req);
    await check('password').notEmpty().withMessage('La contraseña no puede estar vacia').run(req);

    let resultado = validationResult(req);
    const {email, password} = req.body;

        if(!resultado.isEmpty()){
        return res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        errores:resultado.array(),
        usuario:{
            email: email,
            password: password,
        },
        csrfToken:req.csrfToken()
    })
    }

    //verificar si el usuario existe
    const usuario = await modelUsuario.findOne({where:{email: email}})
    if(!usuario){
        return res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        errores:[{msg: 'El usuario no existe'}],
        usuario:{
            email: email,
            password: password,
        },
        csrfToken:req.csrfToken()
    })

    }

    //Verificar si el usuario está confirmado
    if(!usuario.confirmado){
        return res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        errores:[{msg: 'Tu cuenta no ha sido confirmada'}],
        usuario:{
            email: email,
            password: password,
        },
        csrfToken:req.csrfToken()
    })
    }

    //Verificar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        errores:[{msg: 'El correo o la contraseña son incorrectos'}],
        usuario:{
            email: email,
            password: password,
        },
        csrfToken:req.csrfToken()
    })
    }


    //Autenticar el usuario
    const token = jwt.sign({
        nombre:'Jose',
        empresa:'Damn',
    },'Palabra supersecretaaaa',{expiresIn:'1d'})
    console.log(token)
}

const formularioRegistro = (req,res)=>{
    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken:req.csrfToken()
    })


    
}

const registrarU = async (req,res)=>{

    // Validación de campos llenos
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacío').run(req);
    await check('email').isEmail().withMessage('El email no es válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
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
        },
        csrfToken:req.csrfToken()
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
        },
        csrfToken:req.csrfToken()
    })
    }

    //almacenar usuario en la base de datos
    const usuario = await modelUsuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    })

    //enviar email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token,
    })

    //mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        pagina:'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un Email de confirmación, revisa tu bandeja de entrada o spam',
    })
}

// Función para confirmar la cuenta de usuraio
    const confirmar =  async (req,res,next)=>{
        const { token } = req.params;
        // Verificar si el token es válido
        const usuario = await modelUsuario.findOne({
            where: {
                token
            }
        });

        if(!usuario){
            res.render('auth/confirmar',{
                pagina: 'Error al confirmar tu cuenta',
                error: true,
                mensaje: 'hubo un error al confirmar tu cuenta, intenta de nuevo',
            })
        }

        // aqui se confirma la cuenta, se borra el token y se cambia el estado de confirmado a true
        // y se guarda el usuario actualizado
        usuario.token= null;
        usuario.confirmado = true;
        await usuario.save();
        res.render('auth/confirmar',{
                pagina: 'Cuenta confirmada',
                mensaje: 'la cuenta ha sido confirmada correctamente, ya puedes iniciar sesión',
            })
    }

const recuperarPassword = (req,res)=>{
    res.render('auth/recuperar',{
        pagina: 'Recuperar Contraseña',
        csrfToken:req.csrfToken()
    })
}

const resetPassword = async (req,res)=>{

    // Validación del formato de email
    await check('email').isEmail().withMessage('El email no es válido').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/recuperar',{
        pagina: 'Recuperar Contraseña',
        csrfToken:req.csrfToken(),
        errores:resultado.array(),
    })
    }
    const { email } = req.body;
    //Buscar el usuario por email
    const usuario = await modelUsuario.findOne({
        where:{ email }})

    if(!usuario){
        return res.render('auth/recuperar',{
        pagina: 'Recuperar Contraseña',
        csrfToken:req.csrfToken(),
        errores:[{msg: 'El email no pertenece a ningún usuario'}],
    })
    }

    
    if(!usuario){
    res.render('auth/recuperar',{
        pagina: 'Recuperar Contraseña',
        error: true,
        csrfToken:req.csrfToken(),
        errores:resultado.array(),
    })
    }

    usuario.token = generarId();
    await usuario.save();

    //enviar email
    emailRecuperar({
        nombre: usuario.nombre,
        email: email,
        token: usuario.token,
    })

    //renderizar vista de mensaje
    res.render('templates/mensaje',{
        pagina: 'Reestablecer Contraseña',
        mensaje: 'Hemos enviado un email con las instrucciones para reestablecer tu contraseña',
    })
}

const comprobarToken = async (req,res)=>{
    const { token } = req.params;
    const usuario = await modelUsuario.findOne({
        where:{
            token
        }
    })
    if(!usuario){
    return res.render('auth/confirmar',{
        pagina: 'Restablece tu password',
        error: true,
        mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
        csrfToken:req.csrfToken()
    })
    }

    //renderizar vista de formulario para nuevo password
    res.render('auth/reset',{
        pagina: 'Restablece tu password',
        csrfToken:req.csrfToken()
    })
}

const nuevoPassword = async (req,res)=>{
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/reset',{
            pagina: 'Restablece tu password',
            csrfToken:req.csrfToken(),
            errores:resultado.array(),
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    //identificar quien hace el cambio
    const usuario = await modelUsuario.findOne({
        where:{
            token
        }
    })

    //Hashear el nuevo password
    
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.token = null; //eliminar el token
    await usuario.save(); // guardar el password actualizado

    res.render('auth/confirmar',{
        pagina: 'Contraseña modificada correctamente',
        mensaje: 'La contraseña se ha modificado correctamente, ya puedes iniciar sesión',
    })
}
export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrarU,
    confirmar,
    recuperarPassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}