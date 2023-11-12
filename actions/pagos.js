const { Telegraf } = require('telegraf');
const { Registration } = require('../models/payments');
require('dotenv').config();


const bot = new Telegraf(process.env.BOT_TOKEN);

// inscribirse/pagar (funcion) Credit Card Method

const signUp = async (ctx, signature, amount, photo_url) => {
    try {
        await ctx.deleteMessage();
        const invoice = {
            title: `Curso de ${signature}`,
            description: `¡Potencia tu futuro con nuestro curso de ${signature}! Obtén la certificación que necesitas y lleva tu formación académica al siguiente nivel. Desarrolla habilidades de alto valor y alcanza tus metas educativas de manera eficaz!`,
            payload: signature,
            provider_token: process.env.GLOCAL_TOKEN,
            currency: 'USD',
            prices: [
                {
                    label: signature,
                    amount: amount,
                },
            ],
            photo_url: photo_url,
            need_name: true,
            need_email: true,
            need_phone_number: true,
            send_email_to_provider: true,
            photo_size: 4,
            photo_width: 512,
            photo_height: 512,
        };
        await ctx.sendInvoice(invoice);
    } catch (error) {
        ctx.reply(`ha ocurrido un error (${error})`);
        console.log(error);
    }
};

bot.on('pre_checkout_query', async (ctx) => {
    try {
        await ctx.answerPreCheckoutQuery(true);
        const { id, from, currency, total_amount, invoice_payload, order_info } = ctx.update.pre_checkout_query;
        const userData = {
            orderID: id,
            username: from.username ?? 'user',
            first_name: from.first_name,
            currency: currency,
            total: (total_amount),
            signature: invoice_payload,
            name: order_info.name,
            email: order_info.email,
            phone: order_info.phone_number,
        };

        // Guardo los datos del comprador en una variable global.
        global.userData = userData;
    } catch (error) {
        await ctx.answerPreCheckoutQuery(false, 'La compra no pudo ser procesada.');
        console.log(error);
    }
});

bot.on('successful_payment', async (ctx) => {
    const newRegistration = new Registration({
        order_id: global.userData.orderID,
        username: global.userData.username,
        first_name: global.userData.first_name,
        currency: global.userData.currency,
        total: (global.userData.total / 100),
        course: global.userData.signature,
        name: global.userData.name,
        email: global.userData.email,
        phone: global.userData.phone,
        verified: true,
    });
    await newRegistration.save();
    await ctx.replyWithSticker('CAACAgIAAxkBAAEnZ7JlRnVEqWj7As0G2IF0WFywM3tTUgACTwEAAiI3jgR8lZdITHG8FzME');
    await ctx.reply('Felicidades, su pago ha sido procesado exitosamente.');
});


module.exports = {
    signUp: signUp,
    middleware: bot.middleware(),
};