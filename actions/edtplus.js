const { Telegraf } = require('telegraf');
require('dotenv').config();
const { signUp, middleware } = require('./pagos.js');
const { getDollarPrices } = require('venecodollar');
const Course = require('../models/courses.js');

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

// Función de EDT Plus

const menuPlus = async (ctx, info, plan, funciona, costo, horarios, volver, inscribir) => {
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

// Payment Method.

const paymentMethod = async (ctx, inscribirse, pago_movil, volver) => {
    const info = 'Selecciona un método de pago';
    try {
        await ctx.deleteMessage();
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Tarjeta de Crédito 💳', callback_data: inscribirse }, { text: 'Pago Móvil / Transferencia🏦', callback_data: pago_movil }],
                        [{ text: '< Volver', callback_data: volver }],
                    ],
                },
            });
    } catch (error) {
        console.log(error);
    }
};

// Debit / Pago Movil method.

const pagoMovil = async (ctx, signature, at, callback) => {
    try {
        await ctx.deleteMessage();
        const res = await getDollarPrices();
        const BCV = res[5].dollar;
        const modulePrice = await Course.find();
        const info = `
                Pago Móvil

CI: V-12.345.678
Banesco
0412-123456789

Transferencia:
4242-4242-4242-4242
Banesco
Rif: 123456789

${signature} (inscripción)

Total a pagar: ${(modulePrice[at].registration_price * BCV).toFixed(2)} Bs.

                `;
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Confirmar pago ✅', callback_data: callback }],
                    ],
                },
            });

    } catch (error) {
        console.log(error);
    }
};

// Schedules and Info. (funcion)

const infoSchedules = `
Horarios disponibles Online:

1. Lunes y Martes, 9am a 12pm, inicia el 13/11/23

2. Miercoles y Jueves, 1pm a 4pm, inicia el 15/11/23

3. Sabados, 9am-12pm, inicia el 25/11/23
`;
const schedulesPlus = async (ctx, volver) => {
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

// Robótica EDT Plus

bot.action('robotica_plus', async (ctx) => {
    const info = `
    EDT Plus 🤖🕹

    La escuela PLUS un programa educativo para aprender tecnología.

    El futuro es ahora, seguro escuchaste esta frase antes. Precisamente eso es la Escuela PLUS un programa educativo con futuro; diseñado para adolescentes entre 10 y 16 años.
    
    Un programa educativo en especialidades Tech, que incluye programación, robótica e inglés.
    
    ¿Qué hace la escuela PLUS por ti?
    
    Te ayuda a aprender habilidades de alta demanda profesional que te ayudaran a tu desarrollo laboral en el futuro.
`;
    menuPlus(ctx, info, 'plan_de_estudios_ro', 'como_funciona_ro', 'costo_matricula_ro', 'horarios_ro', 'plus', 'metodo_pago_ro');
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
                    [{ text: '< Volver', callback_data: 'robotica_plus' }],
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
                    [{ text: '< Volver', callback_data: 'robotica_plus' }],
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
                    [{ text: '< Volver', callback_data: 'robotica_plus' }],
                ],
            },
        });
});
bot.action('horarios_ro', async (ctx) => {
    schedulesPlus(ctx, 'robotica_plus');
});
bot.action('metodo_pago_ro', async (ctx) => {
    paymentMethod(ctx, 'inscribir_ro', 'pago_movil_ro', 'robotica_plus');
});
bot.action('pago_movil_ro', async (ctx) => {
    pagoMovil(ctx, 'Robótica 🤖', 6, 'hacerPago');
});
bot.action('inscribir_ro', async (ctx) => {
    signUp(ctx, 'Robótica EDT Plus 🤖', 6, 'https://i.imgur.com/mdpWirS.jpg');
});


bot.use(middleware);
module.exports = bot.middleware();