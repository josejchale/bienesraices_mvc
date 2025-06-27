import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const { email, nombre, token } = datos;
    //enviar email
    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Confirma tu cuenta en BienesRaices.com",
        text: "Confirma tu cuenta en BienesRaices.com",
        html:  `<p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
                <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:</p>
                <p><a href="${process.env.BACKEND_URL}:${process.env.PORT??3000}/auth/confirmar/${token}">Confirmar Cuenta</a><p>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`,
    })
};

const emailRecuperar = async (datos) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const { email, nombre, token } = datos;
    //enviar email
    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Reestablece tu password en BienesRaices.com",
        text: "Reestablece tu password en BienesRaices.com",
        html:  `<p>Hola ${nombre}, haz solicitado cambiar tu password en BienesRaices.com</p>
                <p>Sigue el siguiente enlace para reestablecer tu password:</p>
                <p><a href="${process.env.BACKEND_URL}:${process.env.PORT??3000}/auth/confirmar/${token}">Confirmar Cuenta</a><p>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`,
    })
};

export { emailRegistro, emailRecuperar };
