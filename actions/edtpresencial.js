const { Telegraf } = require('telegraf');
require('dotenv').config();
const { signUp, middleware, pagoMovil } = require('./pagos.js');

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
                    [{ text: '< Volver', callback_data: 'volver_cursos' }],
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

1. Lunes y Martes, 9am a 12pm, inicia el 15/01/24

2. Miercoles y Jueves, 1pm a 4pm, inicia el 17/01/24

3. Sabados, 9am-12pm, inicia el 20/01/24
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

// Payment Method.

const paymentMethod = async (ctx, inscribirse, pago_movil, volver) => {
    const info = 'Selecciona un método de pago';
    try {
        await ctx.deleteMessage();
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Tarjeta de Crédito 💳', callback_data: inscribirse }, { text: 'Pago Móvil 📱', callback_data: pago_movil }],
                        [{ text: '< Volver', callback_data: volver }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};

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
    menuPresencial(ctx, info, 'plan_de_estudios_pr', 'como_funciona_pr', 'costo_matricula_pr', 'horarios_pr', 'presencial', 'metodo_pago_pr');
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
    planEstudios(ctx, info, 'programacion');
});
bot.action('como_funciona_pr', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    comoFunciona(ctx, info, 'programacion');
});
bot.action('costo_matricula_pr', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    630 $ en total. La modalidad de pago sería:

    Pago 1 - 130 $ y luego 5 cuotas de 100 $ c/u 
    `;
    costoMatricula(ctx, info, 'programacion');
});
bot.action('horarios_pr', async (ctx) => {
    schedules(ctx, 'programacion');
});
bot.action('metodo_pago_pr', async (ctx) => {
    paymentMethod(ctx, 'inscribir_pr', 'pago_movil_pr', 'programacion');
});
bot.action('pago_movil_pr', async (ctx) => {
    pagoMovil(ctx, 'Programación Full Stack 🚀', 0, 'hacerPago');
});
bot.action('inscribir_pr', async (ctx) => {
    signUp(ctx, 'Programación Full Stack 🚀', 0, 'https://i.imgur.com/hvnITG8.jpg');
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
    menuPresencial(ctx, info, 'plan_de_estudios_dd', 'como_funciona_dd', 'costo_matricula_dd', 'horarios_dd', 'presencial', 'metodo_pago_dd');
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
    planEstudios(ctx, info, 'diseno_digital');

});
bot.action('como_funciona_dd', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    comoFunciona(ctx, info, 'diseno_digital');
});
bot.action('costo_matricula_dd', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    530 $ en total. La modalidad de pago sería:

    Pago 1 - 130 $ y luego 5 cuotas de 80 $ c/u
    `;
    costoMatricula(ctx, info, 'diseno_digital');
});
bot.action('horarios_dd', async (ctx) => {
    schedules(ctx, 'diseno_digital');
});
bot.action('metodo_pago_dd', async (ctx) => {
    paymentMethod(ctx, 'inscribir_dd', 'pago_movil_dd', 'diseno_digital');
});
bot.action('pago_movil_dd', async (ctx) => {
    pagoMovil(ctx, 'Diseño Digital 🎨', 1, 'hacerPago');
});
bot.action('inscribir_dd', async (ctx) => {
    signUp(ctx, 'Diseño Digital', 1, 'https://i.imgur.com/HtX2Dfc.jpg');
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
    menuPresencial(ctx, info, 'plan_de_estudios_mr', 'como_funciona_mr', 'costo_matricula_mr', 'horarios_mr', 'presencial', 'metodo_pago_mr');
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
    planEstudios(ctx, info, 'marketing_redes');
});
bot.action('como_funciona_mr', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    comoFunciona(ctx, info, 'marketing_redes');
});
bot.action('costo_matricula_mr', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    510 $ en total. La modalidad de pago sería:

    Pago 1 - 110 $ y luego 5 cuotas de 80 $ c/u
    `;
    costoMatricula(ctx, info, 'marketing_redes');
});
bot.action('horarios_mr', async (ctx) => {
    schedules(ctx, 'marketing_redes');
});
bot.action('metodo_pago_mr', async (ctx) => {
    paymentMethod(ctx, 'inscribir_mr', 'pago_movil_mr', 'marketing_redes');
});
bot.action('pago_movil_mr', async (ctx) => {
    pagoMovil(ctx, 'Marketing y Redes Sociales 📈', 2, 'hacerPago');
});
bot.action('inscribir_mr', async (ctx) => {
    signUp(ctx, 'Marketing y Redes Sociales', 2, 'https://i.imgur.com/waOlFNb.jpg');
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
    menuPresencial(ctx, info, 'plan_de_estudios_f', 'como_funciona_f', 'costo_matricula_f', 'horarios_f', 'presencial', 'metodo_pago_f');
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
    planEstudios(ctx, info, 'fotografia');
});
bot.action('como_funciona_f', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    Semipresencial - Tendrás acceso al campus con internet de alta velocidad, computadoras y monitores para las prácticas y también podrás acceder al Campus Virtual donde tendrás contenido disponible para practicar.
    `;
    comoFunciona(ctx, info, 'fotografia');
});
bot.action('costo_matricula_f', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    ¡OFERTA fin de trimestre! 360 $ en total. 1er pago 120 $ (inscripción + mensualidad) luego 3 cuotas de 80 $ c/u
    `;
    costoMatricula(ctx, info, 'fotografia');
});
bot.action('horarios_f', async (ctx) => {
    schedules(ctx, 'fotografia');
});
bot.action('metodo_pago_f', async (ctx) => {
    paymentMethod(ctx, 'inscribir_f', 'pago_movil_f', 'fotografia');
});
bot.action('pago_movil_f', async (ctx) => {
    pagoMovil(ctx, 'Fotografía 📷', 3, 'hacerPago');
});
bot.action('inscribir_f', async (ctx) => {
    signUp(ctx, 'Fotografía', 3, 'https://i.imgur.com/lmeAW1r.jpg');
});

bot.use(middleware);
module.exports = bot.middleware();