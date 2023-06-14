import nodemailer from "nodemailer";
import { plantillaVerificar } from "../plantillasEmail/verificar.js";
import { recuperarPasswordHtml } from "../plantillasEmail/recuperarPassword.js";
//Envio de email cuando se registra el usuario.
export const emailRegistro = async (data) => {

  const { email, nombre, token } = data;


  //Datos del servidor de correos.
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Enviando información al correo electronico del usuario.
  const info = await transport.sendMail({
    from: '"OGILVY DESIGN - Confirma tu cuenta"',
    to: email,
    subject: "OGILVY DESIGN - Verifica tu cuenta",
    text: "Comprueba tu cuenta para comenzar a gestionar tus proyectos.",
    html: plantillaVerificar(nombre,token)
  });
}

// `<p>Hola: ${nombre} Comprueba tu cuenta</p>
//       <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 

//       <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

//       <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>   
//       `,

//Envio de email cuando el usuario recupera su contraseña
export const recuperarPassword = async (data) => {

  const { email, nombre, token } = data;


  //Datos del servidor de correos.
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Enviando información al correo electronico del usuario.
  const info = await transport.sendMail({
    from: '"OGILVY DESIGN - Recupera tu contraseña"',
    to: email,
    subject: "OGILVY DESIGN - Recupera tu contraseña",
    text: "Reestable tu contraseña",
    html: recuperarPasswordHtml(nombre,token)
  });
}

// `<p>Hola: ${nombre} hemos recibido una solicitud para restablecer la contraseña </p>
//     <p>Sigue este enlace para poder recuperar tu contraseña: 

//     <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recupera tu password</a>
    
//     <p>Si no has sido tú el que ha solicitado el cambio de contraseña ignora este correo ya que una persona con acceso a tu email puede modificar la contraseña.</p>   
//     `