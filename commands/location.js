const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('ubicacion', async (ctx) => {
    const latitude = 10.4976891;
    const longitude = -66.8432809;

    const locationName = 'EDTécnica';
    const locationDescription = `
    Estamos ubicados aquí Los palos grandes piso 12 blablabla, esperamos verte pronto. Ven a conocernos y descubre todo lo que tenemos para ofrecer en nuestra sede. Contamos con el equipo necesario para tu formación y conexión de internet con alta velocidad. 🚀
#EnfocadosenTuFuturo #Edtecnica
    `;
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