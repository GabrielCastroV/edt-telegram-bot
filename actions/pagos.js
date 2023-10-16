const { Telegraf } = require('telegraf');
const nodemailer = require('nodemailer');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// inscribirse/pagar (funcion)

const signUp = async (ctx, signature, amount, photo_url) => {
    try {
        await ctx.deleteMessage();
        const invoice = {
            title: `Curso de ${signature}`,
            description: `¡Potencia tu futuro con nuestro curso de ${signature}! Obtén la certificación que necesitas y lleva tu formación académica al siguiente nivel. Desarrolla habilidades de alto valor y alcanza tus metas educativas de manera eficaz!`,
            payload: `${signature}`,
            provider_token: process.env.GLOCAL_TOKEN,
            currency: 'USD',
            prices: [
                {
                    label: `Inscripción de ${signature}`,
                    amount: `${amount}`,
                },
            ],
            photo_url: `${photo_url}`,
            need_name: true,
            need_email: true,
            need_phone_number: true,
            send_email_to_provider: true,
            photo_size: 4,
            photo_width: 512,
            photo_height: 512,
        };
        await ctx.sendInvoice(invoice);
    } catch (error) {
        ctx.reply(`ha ocurrido un error (${error})`);
        console.log(error);
    }
};
bot.on('pre_checkout_query', async (ctx) => {
    try {
        await ctx.answerPreCheckoutQuery(true);
        const { id, from, currency, total_amount, invoice_payload, order_info } = ctx.update.pre_checkout_query;
        const userData = {
            orderID: id,
            username: from.username ?? 'user',
            first_name: from.first_name,
            currency: currency,
            total: (total_amount / 100),
            signature: invoice_payload,
            name: order_info.name,
            email: order_info.email,
            phone: order_info.phone_number,
        };

        // Guardo los datos del comprador en una variable global para luego enviarle un email.
        global.userData = userData;
    } catch (error) {
        console.log(error);
        await ctx.answerPreCheckoutQuery(false, 'La compra no pudo ser procesada.');
    }
});

bot.on('successful_payment', async (ctx) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const userData = global.userData;
    try {
        console.log(userData);
        await ctx.reply(`Felicidades ${userData.first_name}, su pago ha sido procesado exitosamente. Por favor revisa tu correo para más información sobre su compra.`);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Inscripción realizada',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Detalles de Compra</title>
                <style>
                    /* Estilos generales */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .header {
                        text-align: center;
                    }
                    .logo {
                        max-width: 200px;
                        margin: 0 auto;
                        display: block;
                    }
                    .info {
                        margin-top: 20px;
                    }
                    .receipt {
                        background-color: #f9f9f9;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    /* Estilos para dispositivos móviles */
                    @media screen and (max-width: 480px) {
                        .container {
                            padding: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://i.imgur.com/RVobKku.jpg" alt="Logo de EDTécnica" class="logo">
                    </div>
                    <h1 style="text-align: center; font-size: 30px;">Bienvenido a EDTécnica</h1>
                    <p>¡Felicidades ${userData.first_name} ya eres estudiante de <b>${userData.signature}</b> en EDTécnica! Hemos recibido y procesado tu pago correctamente. Estamos emocionados de tenerte como parte de nuestra comunidad. A continuación, encontrarás datos de tu compra:</p>
                    <div class="receipt">
                        <h1 style="text-align: center; font-size: 24px;">Detalles de Compra</h1>
                        <ul>
                            <li>Número de orden: #${userData.orderID}</li>
                            <li>Nombre del comprador: ${userData.name}</li>
                            <li>Usuario en Telegram: ${userData.username}</li>
                            <li>Costo de inscripción: ${userData.total} ${userData.currency}</li>
                        </ul>
                        <div style="text-align: end;">
                            ${new Date().toLocaleString()}
                        </div>
                    </div>
                    <p>No dudes en contactarnos si tienes alguna pregunta o necesitas asistencia adicional. ¡Esperamos que disfrutes tu experiencia en EDTécnica!</p>
                    <p>Nuestro Campus EDT está ubicado en Los Palos Grandes, Torre Parque Cristal piso 12 oficina 12-4</p>
                    <div style="text-align: center;">
                        <a href="https://www.google.com/maps/place/EDT%C3%A9cnica+-+Cursos+y+Carreras/@10.4976891,-66.8432809,15z/data=!4m6!3m5!1s0x8c2a597949dc9579:0x7c11b2c3c93dde12!8m2!3d10.4976891!4d-66.8432809!16s%2Fg%2F11h6dz50d_?entry=ttu" style="background-color: #2D59FA; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Conoce nuestra sede</a>
                    </div>
                </div>
            </body>
            </html>
            `,
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = {
    signUp: signUp,
    middleware: bot.middleware(),
};