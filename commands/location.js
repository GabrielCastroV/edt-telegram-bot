const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const latitude = 10.4976891;
const longitude = -66.8432809;
const locationName = 'EDTecnica';
const locationDescription = `
Nuestro Campus EDT está ubicado en Los Palos Grandes, Torre Parque Cristal piso 12 oficina 12-4

Ven a conocernos y descubre todo lo que tenemos para ofrecer en nuestra sede. Contamos con el equipo necesario para tu formación y conexión de internet con alta velocidad. 🚀

Acércate y conversemos.

#EnfocadoseEnTuFuturo #EDTecnica
`;

bot.command('ubicacion', async (ctx) => {
    try {
        await ctx.replyWithLocation(latitude, longitude, {
            live_period: 0,
            title: locationName,
            address: locationDescription,
        });
        await ctx.reply(locationDescription);
    } catch (error) {
        console.log(error);
    }
});

module.exports = bot.middleware();