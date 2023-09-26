const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.action('online', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos online disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Programación 💻', callback_data: 'programacion_on' }, { text: 'Marketing y Redes Sociales 📈', callback_data: 'marketing_redes_on' }],
                    [{ text: '< Volver', callback_data: 'volver_cursos' }],
                ],
            },
        });
});

// Programación

bot.action('programacion_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Programación Full Stack - Online

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.
    
(⏳ Duración: 6 Meses)
`;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_pr_on' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_pr_on' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_pr_on' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_online' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_pr_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
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
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_online_pr' }],
                ],
            },
        });
});
bot.action('como_funciona_pr_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    100 % ONLINE - Acceso al campus virtual con clases en video y sesiones en vivo con un tutor.

    Estarás realizando alrededor de 10 proyectos y al final deberás desarrollar tu propia app la cual deberás presentar en un Demo Day 
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_online_pr' }],
                ],
            },
        });
});
bot.action('costo_matricula_pr_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    500$ en total distribuidos en 100 $ de inscripción + 5 cuotas de 80 $ c/u 

    NOTA: Podrás acceder siempre al campus pero debes estar solventes para desbloquear los módulos. 
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_online_pr' }],
                ],
            },
        });
});
bot.action('volver_edt_online_pr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Programación Full Stack - Online

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.
    
(⏳ Duración: 6 Meses)
`;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_pr_on' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_pr_on' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_pr_on' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_online' }],
                ],
            },
        });
});

// Marketing y Redes Sociales

bot.action('marketing_redes_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Marketing Digital y Redes Sociales - Online

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_mr_on' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_mr_on' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_mr_on' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_online' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_mr_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
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
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_online_mr' }],
                ],
            },
        });
});
bot.action('como_funciona_mr_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    100 % ONLINE - Acceso al campus virtual con clases en video y sesiones en vivo con un tutor.
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_online_mr' }],
                ],
            },
        });
});
bot.action('costo_matricula_mr_on', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    500 $ en total. La modalidad de pago sería:

    Pago 1 - 100 $ y luego 5 cuotas de 80 $ c/u
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_online_mr' }],
                ],
            },
        });
});
bot.action('volver_edt_online_mr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Marketing Digital y Redes Sociales - Online

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_mr_on' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_mr_on' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_mr_on' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_online' }],
                ],
            },
        });
});

// Volver a los cursos online

bot.action('volver_edt_online', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos online disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Programación 💻', callback_data: 'programacion_on' }, { text: 'Marketing y Redes Sociales 📈', callback_data: 'marketing_redes_on' }],
                    [{ text: '< Volver', callback_data: 'volver_cursos' }],
                ],
            },
        });
});

module.exports = bot.middleware();