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

const recuperarPassword = (req,res)=>{
    res.render('auth/recuperar',{
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    recuperarPassword
}