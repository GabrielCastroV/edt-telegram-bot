const { Telegraf } = require('telegraf');
require('dotenv').config();
const commandCourses = require('./commands/courses');
const commandLocation = require('./commands/location');
const commandFaq = require('./commands/faq');

const bot = new Telegraf(process.env.BOT_TOKEN);

const photoPath = 'img/pfp.png';
const welcome = `
¡Bienvenido al Asistente Virtual de EDTecnica!

Somos tu guía personal para explorar todos los servicios y cursos que ofrecemos. Ya sea que estés interesado en aprender programación, diseño digital, marketing, robótica, fotografía u otros campos emocionantes, estamos aquí para ayudarte en cada paso del camino.

Nuestra misión es proporcionarte la mejor experiencia educativa, brindándote acceso a cursos de alta calidad, instructores expertos y una comunidad de aprendizaje apasionada.

Siempre puedes preguntarnos sobre nuestros cursos, fechas de inicio, ubicaciones y cualquier otra información que necesites. Estamos aquí para responder tus preguntas y brindarte la información que necesitas para comenzar tu viaje educativo con EDTecnica.

¡Disfruta explorando y aprendiendo con nosotros!

#EnfocadosenTuFuturo
`;

bot.start(async (ctx) => {
    // Envio el mensaje de bienvenida
    await ctx.replyWithPhoto({ source: photoPath }, {
        caption: welcome,
    });
    await ctx.reply('Elige una opción para comenzar!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Ver ubicación 📌', callback_data: 'ubicacion' }, { text: 'Ver cursos disponibles ✅', callback_data: 'cursos' }],
                [{ text: 'Preguntas Frecuentes 🙋🏻‍♀️', callback_data: 'faq' }],
            ],
        },
    });
});

bot.help((ctx) => {
    ctx.reply(`
    Si tienes algún problema relacionado con el bot, dudas o sugerencias, escribeme directamente -> @avocadostoasted
    `);
});
bot.hears('que', (ctx) => {
    ctx.reply('so🧀');
});

bot.on('sticker', (ctx) => {
    ctx.reply('ta guapo el sticker ajjaj');
});

(async () => {
    try {
        bot.launch();
        console.log('Bot iniciado con éxito.');
    } catch (error) {
        console.log('Ha ocurrido un error al iniciar el bot. \n', error);
    }
})();

bot.use(commandCourses, commandLocation, commandFaq);