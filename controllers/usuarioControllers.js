import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import {emailRegistro,recuperarPassword} from "../helpers/email.js";

const registroUsuario = async (req,res)=>{


    const {body} = req;

    const {email} = req.body;
    //Evitar registros dupicados
    const usuarioYaRegistrado = await Usuario.findOne({email});

    
    if(usuarioYaRegistrado){
        const error = new Error("Este correo ya está en uso");
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(body);
        usuario.token = generarId();
        await usuario.save();   
        
        //Una vez se haya registrado le llegara un correo de confrimación.
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({msg: "Te haz registrado correctamente, verifica tu correo para confirmar tu cuenta"})
    } catch (error) {
        console.log(error)
    }

}


const logueoUsuario = async (req,res) => {

    const {email,password} = req.body;
    //Verificar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error("Usuario no existe");
        return res.status(404).json({msg: error.message});     
    }
    //Verificiar si el usuario esta confirmado (correo)
    if(!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(404).json({msg: error.message});     
    }

    //Verficar el password
    if(await usuario.verificarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    
    }else{
        const error = new Error("Password incorrecto");
        return res.status(404).json({msg: error.message}); 
    }

}

const confirmarCuenta = async(req, res) => {

    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error("Token invalido");
        return res.status(404).json({msg: error.message}); 
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {

    const {email} = req.body;
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error("Usuario no existe");
        return res.status(404).json({msg: error.message});     
    }

    try {
        usuario.token = generarId();
        await usuario.save();

        //Email enviado 
        recuperarPassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })


        res.json({msg: "Hemos enviado un email a tu correo , sigue los pasos"})

    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req, res) => {

    const {token} = req.params;

    const tokenValido = await Usuario.findOne({token});

    if(tokenValido){
        res.json({msg: "Token valido"})
    }else{
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});  
    }


}
const nuevoPassword = async (req, res) => {

    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({token});

    if(usuario){
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({msg: "Password modificado correctamente"})
        } catch (error) {
            console.log(error)
        }
    }else{
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});  
    }

}

const perfil = async (req,res)=> {
    const {usuario} = req;
    res.json(usuario);
}


export {registroUsuario,logueoUsuario,confirmarCuenta,olvidePassword,comprobarToken,nuevoPassword,perfil};
