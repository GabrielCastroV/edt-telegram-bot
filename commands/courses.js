const { Telegraf } = require('telegraf');
require('dotenv').config();
const actionPresencial = require('../actions/edtpresencial');
const actionOnline = require('../actions/edtonline');
const actionPlus = require('../actions/edtplus');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('cursos', (ctx => {
    ctx.reply('Selecciona la modalidad que deseas estudiar', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EDT Plus 👧', callback_data: 'plus' }, { text: 'EDT Presencial', callback_data: 'presencial' }],
                [{ text: 'EDT Online', callback_data: 'online' }],
            ],
        },
    });
}));

bot.use(
    actionPresencial,
    actionOnline,
    actionPlus,
);
module.exports = bot.middleware();