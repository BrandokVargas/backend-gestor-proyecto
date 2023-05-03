import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import mongoose from "mongoose";


const app = express();
app.use(express.json());


dotenv.config();

mongoose.set('strictQuery',true)



conectarDB();

//Configurar los CORS
//Dominios pemitidos a nuestra api para que puedan consumirlo.
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    //Callback nos va a permitir el acceso.
    origin: function(origin,callback){
        //Si el origin localhost:5173 está incluido en nuestra whitelist. 
        console.log(origin)
        if(whitelist.includes(origin)){
            //Puedes usar nuestra servicios de la api.
            callback(null,true);
        }else{
            //No esta permitido usar la api.
            callback(new Error("Error de cors"));
        }
    }
}

app.use(cors(corsOptions));

//Routing
app.use('/api/usuarios',usuarioRoutes);
app.use('/api/proyectos',proyectoRoutes);
app.use('/api/tareas',tareaRoutes);

const PORT = process.env.PORT || 4000;


app.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`);
});