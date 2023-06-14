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
        //console.log(origin)
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


const servidor = app.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`);
});




//Agregando en tiempo real con socket.io
import {Server} from 'socket.io';

const io = new Server(servidor,{
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});


//Abriendo conexion de socket.io
io.on("connection", (socket ) => {
    console.log('Conectado a socket.io')

    //Definir eventos
    //Que es lo que hará cuando ese event ocurra
    //Recibiend o datos desde el front
    socket.on("abrir proyecto",(proyecto)=>{
        socket.join(proyecto);
    }); 

    socket.on("nueva tarea",(tarea) =>{
        socket.to(tarea.proyecto).emit("tarea agregada",tarea)
    });

    socket.on("eliminar tarea",tarea=>{
        socket.to(tarea.proyecto).emit("tarea eliminada",tarea)
    })

    socket.on("actualizar tarea",tarea=>{
        socket.to(tarea.proyecto._id).emit("tarea actualizada",tarea)
    })

    socket.on("cambiar estado",tarea => {
        socket.to(tarea.proyecto._id).emit("nuevo estado",tarea);
    })

});


// //Abriendo conexion de socket.io
// io.on('connection', (socket ) => {
//     console.log('Conectado a socket.io')

//     //Definir eventos
//     //Que es lo que hará cuando ese event ocurra
//     //Recibiendo datos desde el front
//     socket.on("prueba",()=>{
//         console.log("Prueba desde socket io")


//         //Enviando datos desde el backend hacia el frontend
//         socket.emit("respuesta")
//     }) 

// })

