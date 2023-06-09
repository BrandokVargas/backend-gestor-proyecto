import mongoose from "mongoose";


const conectarDB = async () => {

    try {
     
        const conexion = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })    
        const url = `${conexion.connection.host}:${conexion.connection.port}`;
        console.log("Conectado a la base de datos!")  
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;
