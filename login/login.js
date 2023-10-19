const { Telegraf, session, Scenes: { WizardScene, Stage } } = require('telegraf');
require('dotenv').config();

// Creo la wizard scene
const login = new WizardScene(
    'my-login',
    async ctx => {
        ctx.reply('Por favor ingresa tu email:');
        // Abro un espacio en memoria para posteriormente guardar el email.
        ctx.wizard.state.data = {};
        // Paso a la siguiente escena.
        return ctx.wizard.next();
    },
    async ctx => {
        // Aqui guardo el email.
        ctx.wizard.state.data.email = ctx.message.text;
        // Compruebo con expresion regular si verdaderamente es un email y no cualquier otro texto
        const EMAILREGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const emailValidation = EMAILREGEX.test(ctx.wizard.state.data.email);
        if (!emailValidation) {
            await ctx.reply('Email inválido 👎');
            // Salgo de la escena
            return ctx.scene.leave();
        }
        await ctx.reply('email correcto');
        return ctx.scene.leave();
    },
);
const stage = new Stage([login]);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());
bot.command('login', ctx => {
    ctx.scene.enter('my-login');
});
module.exports = bot.middleware();