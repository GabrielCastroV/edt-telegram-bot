const { Telegraf } = require('telegraf');
const TelegramUser = require('./models/telegram-user');
require('dotenv').config();
const commandCourses = require('./commands/courses');
const commandLocation = require('./commands/location');
const commandFaq = require('./commands/faq');
const login = require('./login/login');

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start(async (ctx) => {
    const user = TelegramUser.findOne({ telegramId: ctx.update.message.chat.id });
    if (!user) {
        const newUser = new TelegramUser({
            telegramId: ctx.update.message.chat.id,
            name: ctx.update.message.chat.first_name,
            username: ctx.update.message.chat?.username,
            type: ctx.update.message.chat.type,
        });
        await newUser.save();
        console.log('Usuario nuevo creado.', newUser);
    } else if (user.name !== ctx.update.message.chat.first_name || user.username !== ctx.update.message.chat.username || user.type !== ctx.update.message.chat.type) {
        await TelegramUser.findOneAndUpdate({ telegramId: ctx.update.message.chat.id }, {
            name: ctx.update.message.chat.first_name,
            username: ctx.update.message.chat.username,
            type: ctx.update.message.chat.type,
        });
        console.log(`El usuario ${ctx.update.message.chat.first_name} ha sido actualizado`);
    }
    const photoPath = 'img/pfp.png';
    const welcome = `
¡Bienvenido al Asistente Virtual de EDTecnica!

Somos tu guía personal para explorar todos los servicios y cursos que ofrecemos. Ya sea que estés interesado en aprender programación, diseño digital, marketing, robótica, fotografía u otros campos emocionantes, estamos aquí para ayudarte en cada paso del camino.

Nuestra misión es proporcionarte la mejor experiencia educativa, brindándote acceso a cursos de alta calidad, instructores expertos y una comunidad de aprendizaje apasionada.

Siempre puedes preguntarnos sobre nuestros cursos, fechas de inicio, ubicaciones y cualquier otra información que necesites. Estamos aquí para responder tus preguntas y brindarte la información que necesitas para comenzar tu viaje educativo con EDTecnica.

¡Disfruta explorando y aprendiendo con nosotros!

#EnfocadoseEnTuFuturo
`;
    await ctx.replyWithPhoto({ source: photoPath }, {
        caption: welcome,
    });
    await ctx.reply('Elige una opción para comenzar!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Ubicación 📌', url: 'https://www.google.com/maps/place/EDT%C3%A9cnica+-+Cursos+y+Carreras/@10.4976891,-66.8432809,15z/data=!4m6!3m5!1s0x8c2a597949dc9579:0x7c11b2c3c93dde12!8m2!3d10.4976891!4d-66.8432809!16s%2Fg%2F11h6dz50d_?entry=ttu' }, { text: 'Cursos disponibles ✅', callback_data: 'cursos' }],
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

bot.use(commandCourses, commandLocation, commandFaq, login);