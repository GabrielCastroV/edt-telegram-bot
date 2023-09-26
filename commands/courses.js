const { Telegraf } = require('telegraf');
require('dotenv').config();
const actionPresencial = require('../actions/edtpresencial');
const actionOnline = require('../actions/edtonline');
const actionPlus = require('../actions/edtplus');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('cursos', (ctx) => {
    ctx.reply('Selecciona la modalidad que deseas estudiar', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EDT Plus 👧', callback_data: 'plus' }, { text: 'EDT Presencial', callback_data: 'presencial' }],
                [{ text: 'EDT Online', callback_data: 'online' }],
            ],
        },
    });
});

bot.action('cursos', async (ctx) => {
    try {
        await ctx.deleteMessage();
        await ctx.reply('Selecciona la modalidad que deseas estudiar', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'EDT Plus 👧', callback_data: 'plus' }, { text: 'EDT Presencial', callback_data: 'presencial' }],
                    [{ text: '< Volver', callback_data: 'volver_inicio' }, { text: 'EDT Online', callback_data: 'online' }],
                ],
            },
        });
    } catch (error) {
        console.log(error);
    }
});

bot.action('volver_inicio', async (ctx) => {
    try {
        ctx.deleteMessage();
        await ctx.reply('Elige una opción para comenzar!', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Ver ubicación 📌', callback_data: 'ubicacion' }, { text: 'Ver cursos disponibles ✅', callback_data: 'cursos' }],
                    [{ text: 'Preguntas Frecuentes 🙋🏻‍♀️', callback_data: 'faq' }],
                ],
            },
        });
    } catch (error) {
        console.log(error);
    }
});

bot.use(
    actionPresencial,
    actionOnline,
    actionPlus,
);
module.exports = bot.middleware();