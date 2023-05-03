import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioModel = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, 
    },

    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true,
});

//hashea el password
usuarioModel.pre('save',async function(next){
    //Lo que hace esto es verificar que el password no haya sido cambiado.
    //Sino modifico el password no haga nada.
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})


//Comprobar password
usuarioModel.methods.verificarPassword = async function(passwordFormulario){
    //Verifica un string  que no esta hasheado por uno que si está.
    return await bcrypt.compare(passwordFormulario,this.password)

}

const Usuario = mongoose.model("Usuario",usuarioModel);
export default Usuario;