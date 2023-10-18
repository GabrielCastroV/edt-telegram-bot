const { Telegraf, session, Scenes: { WizardScene, Stage } } = require('telegraf');
require('dotenv').config();
const login = new WizardScene(
    'my-login',
    async ctx => {
        ctx.reply('Por favor ingresa tu email:');
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.wizard.state.data.email = ctx.message.text;
        const EMAILREGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const emailValidation = EMAILREGEX.test(ctx.wizard.state.data.email);
        if (!emailValidation) {
            await ctx.reply('Email inválido 👎');
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