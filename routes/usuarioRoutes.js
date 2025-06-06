import  express  from 'express';

const router = express.Router();

//Routing
router.get("/login", function(req,res){
    res.render('auth/login',{
        autenticado:true
    })
})

export default router;