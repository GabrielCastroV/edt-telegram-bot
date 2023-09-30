const { Telegraf } = require('telegraf');
require('dotenv').config();
const actionPresencial = require('../actions/edtpresencial');
const actionOnline = require('../actions/edtonline');
const actionPlus = require('../actions/edtplus');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('cursos', async (ctx) => {
    try {
        await ctx.reply('Selecciona la modalidad que deseas estudiar', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'EDT Plus 👧', callback_data: 'plus' }, { text: 'EDT Presencial', callback_data: 'presencial' }],
                    [{ text: 'EDT Online', callback_data: 'online' }],
                ],
            },
        });
    } catch (error) {
        console.log(error);
    }
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
        await ctx.deleteMessage();
        await ctx.reply('Elige una opción para comenzar!', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Ubicación 📌', url: 'https://www.google.com/maps/place/EDT%C3%A9cnica+-+Cursos+y+Carreras/@10.4976891,-66.8432809,15z/data=!4m6!3m5!1s0x8c2a597949dc9579:0x7c11b2c3c93dde12!8m2!3d10.4976891!4d-66.8432809!16s%2Fg%2F11h6dz50d_?entry=ttu' }, { text: 'Cursos disponibles ✅', callback_data: 'cursos' }],
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