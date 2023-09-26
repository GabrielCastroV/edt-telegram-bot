const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.action('plus', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos de EDT Plus disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_cursos' }, { text: 'Robótica 🤖', callback_data: 'robotica_plus' }],
                    [],
                ],
            },
        });
});

// Robótica EDT Plus

bot.action('robotica_plus', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    EDT Plus 🤖🕹

    La escuela PLUS un programa educativo para aprender tecnología.

    El futuro es ahora, seguro escuchaste esta frase antes. Precisamente eso es la Escuela PLUS un programa educativo con futuro; diseñado para adolescentes entre 10 y 16 años.
    
    Un programa educativo en especialidades Tech, que incluye programación, robótica e inglés.
    
    ¿Qué hace la escuela PLUS por ti?
    
    Te ayuda a aprender habilidades de alta demanda profesional que te ayudaran a tu desarrollo laboral en el futuro.
`;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_ro' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_ro' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_ro' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_plus_cursos' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_ro', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Plan de Estudios:

    ✔ Fundamentos de la programación y robótica 
    ✔ Programación con Scratch
    ✔ Programación con C++
    ✔ Programación con Python
    ✔ Mecánica y electrónica detrás de la robótica
    ✔ Robótica I ensamblado
    ✔ Robótica II funcionamiento

    Todo mientras nos divertimos y la pasamos increíble 🥳

    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_plus' }],
                ],
            },
        });
});
bot.action('como_funciona_ro', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    Modalidad B-learning, tienes dos o una clase por semana y acceso a una plataforma online que le permite mantenerse en aprendizaje constante 
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_plus' }],
                ],
            },
        });
});
bot.action('costo_matricula_ro', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    Inscripción y primer mes 100 $

    Luego 5 pagos de 60 $ c/u mensuales.
    
    Total 400 $ por 6 meses de entrenamiento y desarrollo profesional.
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_plus' }],
                ],
            },
        });
});
bot.action('volver_edt_plus', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    EDT Plus 🤖🕹

    La escuela PLUS un programa educativo para aprender tecnología.

    El futuro es ahora, seguro escuchaste esta frase antes. Precisamente eso es la Escuela PLUS un programa educativo con futuro; diseñado para adolescentes entre 10 y 16 años.
    
    Un programa educativo en especialidades Tech, que incluye programación, robótica e inglés.
    
    ¿Qué hace la escuela PLUS por ti?
    
    Te ayuda a aprender habilidades de alta demanda profesional que te ayudaran a tu desarrollo laboral en el futuro.
`;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_ro' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_ro' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_ro' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_plus_cursos' }],
                ],
            },
        });
});

// Volver menu de EDT plus cursos

bot.action('volver_edt_plus_cursos', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos de EDT Plus disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_cursos' }, { text: 'Robótica 🤖', callback_data: 'robotica_plus' }],
                    [],
                ],
            },
        });
});

module.exports = bot.middleware();