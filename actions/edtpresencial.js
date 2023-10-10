const { Telegraf } = require('telegraf');
const nodemailer = require('nodemailer');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.action('presencial', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Programación 💻', callback_data: 'programacion' }, { text: 'Diseño Digital 🎨', callback_data: 'diseno_digital' }],
                    [{ text: 'Marketing y Redes Sociales 📈', callback_data: 'marketing_redes' }, { text: 'Fotografía 📷', callback_data: 'fotografia' }],
                    [{ text: '< Volver', callback_data: 'volver_cursos' } ],
                ],
            },
        });
});
bot.action('volver_cursos', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply('Selecciona la modalidad que deseas estudiar', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EDT Plus 👧', callback_data: 'plus' }, { text: 'EDT Presencial', callback_data: 'presencial' }],
                [{ text: '< Volver', callback_data: 'volver_inicio' }, { text: 'EDT Online', callback_data: 'online' }],
            ],
        },
    });
});

// Función de presencial

const menuPresencial = async (ctx, info, plan, funciona, costo, horarios, volver, inscribir) => {
    try {
        await ctx.deleteMessage();
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Plan de Estudios', callback_data: plan }, { text: '¿Cómo funciona?', callback_data: funciona }],
                        [{ text: '¿Costo por matricula?', callback_data: costo }, { text: 'Horarios', callback_data: horarios }],
                        [{ text: '< Volver', callback_data: volver }, { text: 'Inscribirme ✅', callback_data: inscribir }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};

// Plan de estudios (funcion)

const planEstudios = async (ctx, info, volver) => {
    try {
        await ctx.deleteMessage();
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '< Volver', callback_data: volver }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};

// Como funciona (funcion)

const comoFunciona = async (ctx, info, volver) => {
    try {
        await ctx.deleteMessage();
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '< Volver', callback_data: volver }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};
// Costo por matricula (funcion)

const costoMatricula = async (ctx, info, volver) => {
    try {
        await ctx.deleteMessage();
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '< Volver', callback_data: volver }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};

// Schedules and Info. (funcion)

const infoSchedules = `
Horarios disponibles:

1. Lunes y Martes, 9am a 12pm, inicia el 13/11/23

2. Miercoles y Jueves, 1pm a 4pm, inicia el 15/11/23

3. Sabados, 9am-12pm, inicia el 25/11/23
`;
const schedules = async (ctx, volver) => {
    try {
        await ctx.deleteMessage();
        await ctx.reply(infoSchedules,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '< Volver', callback_data: volver }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};


// inscribirse/pagar (funcion)

const signUp = async (ctx, signature, amount) => {
    try {
        await ctx.deleteMessage();
        const invoice = {
            title: `Curso de ${signature}`,
            description: `¡Potencia tu futuro con nuestro curso de ${signature}! Obtén la certificación que necesitas y lleva tu formación académica al siguiente nivel. Desarrolla habilidades de alto valor y alcanza tus metas educativas de manera eficaz!`,
            payload: '1234567890',
            provider_token: process.env.GLOCAL_TOKEN,
            currency: 'USD',
            prices: [
                {
                    label: `Inscripción de ${signature}`,
                    amount: `${amount}`,
                },
            ],
            photo_url: 'https://logowik.com/content/uploads/images/3799-javascript.jpg',
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
        const { id, from, currency, total_amount, order_info } = ctx.update.pre_checkout_query;
        const userData = {
            orderID: id,
            username: from.username,
            currency: currency,
            total: (total_amount / 100),
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
    ctx.reply('Pago realizado con éxito');
    const userData = global.userData;
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Inscripción realizada',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenido a EDTécnica</title>
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
                    .welcome-message {
                        text-align: center;
                        font-size: 24px;
                        margin-top: 20px;
                    }
                    .info {
                        margin-top: 20px;
                    }
                    /* Estilos para dispositivos móviles */
                    @media screen and (max-width: 480px) {
                        .container {
                            padding: 10px;
                        }
                        .welcome-message {
                            font-size: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://i.imgur.com/RVobKku.jpg" alt="Logo de EDTécnica" class="logo">
                    </div>
                    <div class="welcome-message">
                        ¡Bienvenido a EDTécnica!
                    </div>
                    <div class="info">
                        <p>¡Felicidades, ya eres estudiante! Hemos recibido y procesado tu pago correctamente. Estamos emocionados de tenerte como parte de nuestra comunidad. A continuación, encontrarás información adicional:</p>
                        <ul>
                            <li>Detalles del curso</li>
                            <li>Fecha de inicio</li>
                            <li>Horarios</li>
                            <!-- Agrega más información relevante aquí -->
                        </ul>
                        <p>No dudes en contactarnos si tienes alguna pregunta o necesitas asistencia adicional. ¡Esperamos que disfrutes tu experiencia en EDTécnica!</p>
                        <p>Nuestro Campus EDT está ubicado en Los Palos Grandes, Torre Parque Cristal piso 12 oficina 12-4</p>
                        <div style="text-align: center;">
                            <a href="https://www.google.com/maps/place/EDT%C3%A9cnica+-+Cursos+y+Carreras/@10.4976891,-66.8432809,15z/data=!4m6!3m5!1s0x8c2a597949dc9579:0x7c11b2c3c93dde12!8m2!3d10.4976891!4d-66.8432809!16s%2Fg%2F11h6dz50d_?entry=ttu" style="background-color: #2D59FA; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Conoce nuestra sede</a>
                        </div>

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

// Programación

bot.action('programacion', async (ctx) => {
    const info = `
    Programación Full Stack

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.
    
(⏳ Duración: 6 Meses)
`;
    menuPresencial(ctx, info, 'plan_de_estudios_pr', 'como_funciona_pr', 'costo_matricula_pr', 'horarios_pr', 'volver_edt_presencial', 'inscribir_pr');
});
bot.action('plan_de_estudios_pr', async (ctx) => {
    const info = `
    Plan de Estudios:

    ✔ Lógica y algoritmo 
    ✔ Fundamentos de la programación I
    ✔ HTML y CSS
    ✔ JavaScript
    ✔ JavaScript Avanzando
    ✔ Node JS
    ✔ Mongo DB
    ✔ Express JS

    Durante todo el BootCamp desarrollarás al menos 10 proyectos reales.  
    `;
    planEstudios(ctx, info, 'volver_edt_presencial_pr');
});
bot.action('como_funciona_pr', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    comoFunciona(ctx, info, 'volver_edt_presencial_pr');
});
bot.action('costo_matricula_pr', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    630 $ en total. La modalidad de pago sería:

    Pago 1 - 130 $ y luego 5 cuotas de 100 $ c/u 
    `;
    costoMatricula(ctx, info, 'volver_edt_presencial_pr');
});
bot.action('horarios_pr', async (ctx) => {
    schedules(ctx, 'volver_edt_presencial_pr');
});
bot.action('inscribir_pr', async (ctx) => {
    signUp(ctx, 'Programación Full Stack 🚀', 13000);
});
bot.action('volver_edt_presencial_pr', async (ctx) => {
    const info = `
    Programación Full Stack

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.

(⏳ Duración: 6 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_pr', 'como_funciona_pr', 'costo_matricula_pr', 'horarios_pr', 'volver_edt_presencial', 'inscribir_pr');
});

// Diseño digital

bot.action('diseno_digital', async (ctx) => {
    const info = `
    Diseño Digital

La verdad no te diría mucho si te digo que el diseño está presente en todo. Todo es diseño, arte, impresión, empaques y ni que decir de redes sociales. Es decir, una carrera en expansión. 

Hemos diseñado un diplomado genial, super actualizado.

Dentro del Campus EDT cuentas con equipos y todos los software con sus respectivas licencias para practicar tanto como sea posible. 

Estas listo para explotar tu creatividad y vivir de ello.

Esta carrera técnica tiene aval universitario y además tenemos un programa de pasantía brutal.

(⏳ Duración: 6 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_dd', 'como_funciona_dd', 'costo_matricula_dd', 'horarios_dd', 'volver_edt_presencial', 'inscribir_dd');
});
bot.action('plan_de_estudios_dd', async (ctx) => {
    const info = `
    Plan de Estudios:

    ✔ Principios del diseño gráfico
    ✔ Psicología del Color
    ✔ Photoshop I y II
    ✔ Illustrator I y II
    ✔ Paquete para Redes Sociales: Logo, flyers, miniaturas y mas.
    ✔ Paquete para publicidad exterior POP: franelas, tazas, gorras y mas.
    ✔ Paquete para la web: Plantillas, favicon, logos, miniaturas, botones y mucho mas.
    ✔ Diagramación Digital
    ✔ Edición en Móvil
    ✔ Proyecto Final
    `;
    planEstudios(ctx, info, 'volver_edt_presencial_dd');

});
bot.action('como_funciona_dd', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    comoFunciona(ctx, info, 'volver_edt_presencial_dd');
});
bot.action('costo_matricula_dd', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    530 $ en total. La modalidad de pago sería:

    Pago 1 - 130 $ y luego 5 cuotas de 80 $ c/u
    `;
    costoMatricula(ctx, info, 'volver_edt_presencial_dd');
});
bot.action('horarios_dd', async (ctx) => {
    schedules(ctx, 'volver_edt_presencial_dd');
});
bot.action('inscribir_dd', async (ctx) => {
    signUp(ctx, 'Diseño Digital', 13000);
});
bot.action('volver_edt_presencial_dd', async (ctx) => {
    const info = `
    Diseño Digital

La verdad no te diría mucho si te digo que el diseño está presente en todo. Todo es diseño, arte, impresión, empaques y ni que decir de redes sociales. Es decir, una carrera en expansión. 

Hemos diseñado un diplomado genial, super actualizado.

Dentro del Campus EDT cuentas con equipos y todos los software con sus respectivas licencias para practicar tanto como sea posible. 

Estas listo para explotar tu creatividad y vivir de ello.

Esta carrera técnica tiene aval universitario y además tenemos un programa de pasantía brutal.

(⏳ Duración: 6 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_dd', 'como_funciona_dd', 'costo_matricula_dd', 'horarios_dd', 'volver_edt_presencial', 'inscribir_dd');
});

// Marketing y Redes Sociales

bot.action('marketing_redes', async (ctx) => {
    const info = `
    Marketing Digital y Redes Sociales 

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_mr', 'como_funciona_mr', 'costo_matricula_mr', 'horarios_mr', 'volver_edt_presencial', 'inscribir_mr');
});
bot.action('plan_de_estudios_mr', async (ctx) => {
    const info = `
    Plan de Estudios:

    ✔ El marketing como palanca en los negocios: La máquina de generar prospectos
    ✔ Consumidor digital
    ✔ Mercadeo Digital
    ✔ Tendencias en redes sociales
    ✔ Análisis de Competidores
    ✔ Redacción 2.0
    ✔ Redes sociales para el marketing
    ✔ Analítica web y herramientas
    ✔ Herramientas para validar nichos o descubrir nuevos
    ✔ Marketing de Contenido: Redes sociales y Blogger
    ✔ Marketing de Influencer: análisis, tendencias y negociación
    ✔ E-mail Marketing
    ✔ WhatsApp - Telegram Marketing
    ✔ Manejo de Crisis
    ✔ Herramientas de gestión y optimización
    ✔ Equipo social media dentro de la empresa
    ✔ Plan de marketing ¿Cómo lograr generar prospectos?
    `;
    planEstudios(ctx, info, 'volver_edt_presencial_mr');
});
bot.action('como_funciona_mr', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    comoFunciona(ctx, info, 'volver_edt_presencial_mr');
});
bot.action('costo_matricula_mr', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    510 $ en total. La modalidad de pago sería:

    Pago 1 - 110 $ y luego 5 cuotas de 80 $ c/u
    `;
    costoMatricula(ctx, info, 'volver_edt_presencial_mr');
});
bot.action('horarios_mr', async (ctx) => {
    schedules(ctx, 'volver_edt_presencial_mr');
});
bot.action('inscribir_mr', async (ctx) => {
    signUp(ctx, 'Marketing y Redes Sociales', 11000);
});
bot.action('volver_edt_presencial_mr', async (ctx) => {
    const info = `
    Marketing Digital y Redes Sociales

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_mr', 'como_funciona_mr', 'costo_matricula_mr', 'horarios_mr', 'volver_edt_presencial', 'inscribir_mr');
});

// Fotografia

bot.action('fotografia', async (ctx) => {
    const info = `
    Fotografía y edición de videos PRO

Desbloquea una habilidad que te permita generar ingresos presencial o remoto desde cualquier parte del mundo. Sí… se trata las artes visuales. 

Cómo puedes estudiar Fotografía y edición de video en EDTécnica 

Algo obvio pero… por si acaso.

Necesitas cualquier cámara, aunque si tienes una PRO sería genial. 

También vas a necesitar alguna versión de Adobe Premiere Pro CC para poder editar tus videos. De todos modos tenemos laboratorio equipado con equipos y todo los software de la suite de adobe para realizar tus prácticas.

¿Qué lograrás una vez finalice tu curso?

Crear tu primera sesión de fotos artística y tu primer trabajo documental.

(⏳ Duración: 4 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_f', 'como_funciona_f', 'costo_matricula_f', 'horarios_f', 'volver_edt_presencial', 'inscribir_f');
});
bot.action('plan_de_estudios_f', async (ctx) => {
    const info = `
    Plan de Estudios:

    ✔ Fotografía nivel I
    ✔ Fotografía Artística
    ✔ Audiovisuales: Pre y Producción
    ✔ Audiovisuales: Haciendo la magia
    ✔ Proyecto Audiovisual
    `;
    planEstudios(ctx, info, 'volver_edt_presencial_f');
});
bot.action('como_funciona_f', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    Semipresencial - Tendrás acceso al campus con internet de alta velocidad, computadoras y monitores para las prácticas y también podrás acceder al Campus Virtual donde tendrás contenido disponible para practicar.
    `;
    comoFunciona(ctx, info, 'volver_edt_presencial_f');
});
bot.action('costo_matricula_f', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    ¡OFERTA fin de trimestre! 360 $ en total. 1er pago 120 $ (inscripción + mensualidad) luego 3 cuotas de 80 $ c/u
    `;
    costoMatricula(ctx, info, 'volver_edt_presencial_f');
});
bot.action('horarios_f', async (ctx) => {
    schedules(ctx, 'volver_edt_presencial_f');
});
bot.action('inscribir_f', async (ctx) => {
    signUp(ctx, 'Fotografía', 12000);
});
bot.action('volver_edt_presencial_f', async (ctx) => {
    const info = `
    Fotografía y edición de videos PRO
    
    Desbloquea una habilidad que te permita generar ingresos presencial o remoto desde cualquier parte del mundo. Sí… se trata las artes visuales. 
    
    Cómo puedes estudiar Fotografía y edición de video en EDTécnica 
    
    Algo obvio pero… por si acaso.
    
    Necesitas cualquier cámara, aunque si tienes una PRO sería genial. 
    
    También vas a necesitar alguna versión de Adobe Premiere Pro CC para poder editar tus videos. De todos modos tenemos laboratorio equipado con equipos y todo los software de la suite de adobe para realizar tus prácticas.
    
    ¿Qué lograrás una vez finalice tu curso?
    
    Crear tu primera sesión de fotos artística y tu primer trabajo documental.
    
    (⏳ Duración: 4 Meses)
    `;
    menuPresencial(ctx, info, 'plan_de_estudios_f', 'como_funciona_f', 'costo_matricula_f', 'horarios_f', 'volver_edt_presencial', 'inscribir_f');
});

// Volver a los cursos presenciales
bot.action('volver_edt_presencial', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Programación 💻', callback_data: 'programacion' }, { text: 'Diseño Digital 🎨', callback_data: 'diseno_digital' }],
                    [{ text: 'Marketing y Redes Sociales 📈', callback_data: 'marketing_redes' }, { text: 'Fotografía 📷', callback_data: 'fotografia' }],
                    [{ text: '< Volver', callback_data: 'volver_cursos' } ],
                ],
            },
        });
});

bot.command('a', async (ctx) => {
    signUp(ctx, 'Programacion Full Stack', 13000);
});
module.exports = bot.middleware();