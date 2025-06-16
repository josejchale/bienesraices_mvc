import modelUsuario from "../models/modelUsuario.js"

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
    const usuario= await modelUsuario.create(req.body);
    console.log(usuario);
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