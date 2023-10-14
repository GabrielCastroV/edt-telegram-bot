const { Telegraf } = require('telegraf');
require('dotenv').config();
const { signUp, middleware } = require('./pagos.js');

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

// Función de Online

const menuOnline = async (ctx, info, plan, funciona, costo, horarios, volver, inscribir) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
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
};

// Plan de estudios online (funcion)

const planEstudiosOnline = async (ctx, info, volver) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: volver }],
                ],
            },
        });
};

// Como funciona online (funcion)

const comoFuncionaOnline = async (ctx, info, volver) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: volver }],
                ],
            },
        });
};
// Costo por matricula (funcion)

const costoMatriculaOnline = async (ctx, info, volver) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: volver }],
                ],
            },
        });
};

// Schedules and Info. (funcion)

const infoSchedules = `
Horarios disponibles Online:

1. Lunes y Martes, 9am a 12pm, inicia el 13/11/23

2. Miercoles y Jueves, 1pm a 4pm, inicia el 15/11/23

3. Sabados, 9am-12pm, inicia el 25/11/23
`;
const schedulesOnline = async (ctx, volver) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply(infoSchedules,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: volver }],
                ],
            },
        });
};

// Programación

bot.action('programacion_on', async (ctx) => {
    const info = `
    Programación Full Stack - Online

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.
    
(⏳ Duración: 6 Meses)
`;
    menuOnline(ctx, info, 'plan_de_estudios_pr_on', 'como_funciona_pr_on', 'costo_matricula_pr_on', 'horarios_pr_on', 'volver_edt_online', 'inscribir_pr_on');
});
bot.action('plan_de_estudios_pr_on', async (ctx) => {
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
    planEstudiosOnline(ctx, info, 'volver_edt_online_pr');
});
bot.action('como_funciona_pr_on', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    100 % ONLINE - Acceso al campus virtual con clases en video y sesiones en vivo con un tutor.

    Estarás realizando alrededor de 10 proyectos y al final deberás desarrollar tu propia app la cual deberás presentar en un Demo Day 
    `;
    comoFuncionaOnline(ctx, info, 'volver_edt_online_pr');
});
bot.action('costo_matricula_pr_on', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    500$ en total distribuidos en 100 $ de inscripción + 5 cuotas de 80 $ c/u 

    NOTA: Podrás acceder siempre al campus pero debes estar solventes para desbloquear los módulos. 
    `;
    costoMatriculaOnline(ctx, info, 'volver_edt_online_pr');
});
bot.action('horarios_pr_on', async (ctx) => {
    schedulesOnline(ctx, 'volver_edt_online_pr');
});
bot.action('inscribir_pr_on', async (ctx) => {
    signUp(ctx, 'Programación Full Stack Online 🚀', 10000, 'https://i.imgur.com/hvnITG8.jpg');
});
bot.action('volver_edt_online_pr', async (ctx) => {
    const info = `
    Programación Full Stack - Online
    
    Una de las habilidades de mayor demanda laboral es ¡Programador!
    
    Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.
    
    Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.
    
    Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.
    
    (⏳ Duración: 6 Meses)
    `;
    menuOnline(ctx, info, 'plan_de_estudios_pr_on', 'como_funciona_pr_on', 'costo_matricula_pr_on', 'horarios_pr_on', 'volver_edt_online', 'inscribir_pr_on');
});

// Marketing y Redes Sociales

bot.action('marketing_redes_on', async (ctx) => {
    const info = `
    Marketing Digital y Redes Sociales - Online

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    menuOnline(ctx, info, 'plan_de_estudios_mr_on', 'como_funciona_mr_on', 'costo_matricula_mr_on', 'horarios_mr_on', 'volver_edt_online', 'inscribir_mr_on');
});
bot.action('plan_de_estudios_mr_on', async (ctx) => {
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
    planEstudiosOnline(ctx, info, 'volver_edt_online_mr');
});
bot.action('como_funciona_mr_on', async (ctx) => {
    const info = `
    ¿Cómo funciona?

    100 % ONLINE - Acceso al campus virtual con clases en video y sesiones en vivo con un tutor.
    `;
    comoFuncionaOnline(ctx, info, 'volver_edt_online_mr');
});
bot.action('costo_matricula_mr_on', async (ctx) => {
    const info = `
    ¿Costo por matricula?

    500 $ en total. La modalidad de pago sería:

    Pago 1 - 100 $ y luego 5 cuotas de 80 $ c/u
    `;
    costoMatriculaOnline(ctx, info, 'volver_edt_online_mr');
});
bot.action('horarios_mr_on', async (ctx) => {
    schedulesOnline(ctx, 'volver_edt_online_mr');
});
bot.action('inscribir_mr_on', async (ctx) => {
    signUp(ctx, 'Marketing y Redes Sociales Online', 10000, 'https://i.imgur.com/34YMyWK.jpg');
});
bot.action('volver_edt_online_mr', async (ctx) => {
    const info = `
    Marketing Digital y Redes Sociales - Online

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    menuOnline(ctx, info, 'plan_de_estudios_mr_on', 'como_funciona_mr_on', 'costo_matricula_mr_on', 'horarios_mr_on', 'volver_edt_online', 'inscribir_mr_on');
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

bot.use(middleware);
module.exports = bot.middleware();