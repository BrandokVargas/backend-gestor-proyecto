import express from "express";

const router = express.Router();
import {
    registroUsuario,
    logueoUsuario,
    confirmarCuenta,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil} 
from "../controllers/usuarioControllers.js"
import checkAuth from  "../middleware/checkAuth.js";

//routes.get("/",usuarios)

//Autenticación de usuario, registro  confirmación de usuario
router.post("/",registroUsuario) 
router.post("/login",logueoUsuario)
router.get('/confirmar/:token',confirmarCuenta)
router.post('/olvide-password',olvidePassword)
//router.get('/olvide-password/:token',comprobarToken)
//router.post('/olvide-password/:token',nuevoPassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);




router.get('/perfil',checkAuth,perfil);


export default router;